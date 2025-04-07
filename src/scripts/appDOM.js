import Task from './tasks.js';
import Project from './projects.js';

const container = document.getElementById('projects');
const form = document.querySelector('form');
const projects = getProjects();

const inProjects = (name) => {
  for (const project of projects) 
  {
    if (name === project.name) return true;
    console.log(name, project.name);
  }
  console.log('fail');
  return false;
};

form.addEventListener('click', (event) => {
  event.preventDefault();

  const projectName = document.getElementById('projectname');
  if (!projectName.value) return;
  if (inProjects(projectName.value)) return;
  const newProject = new Project(projectName.value);
  projects.push(newProject);
  projectName.value = '';
  display();
});

const deleteProject = name => {
  if (name === "default") return;
  projects.forEach((p, i) => {
    if (p.name === name) 
    {
      projects.splice(i, 1);
      return;
    }
  })
};

function getProjects () {
  const p = localStorage.getItem("projects");
  if (p)
  {
    const jsonObject = JSON.parse(p);
    const projectObjects = jsonObject.map(el => {
      const project = new Project(el.name);
      el.tasks.forEach(task => {
        const newTask = new Task(task.title, task.description, task.dueDate, task.priority, task.status);
        project.addTask(newTask);
      });
      return project
    });
    return projectObjects;
  }
  const newProject = new Project("default");
  return [newProject];
};

const saveProjects = () => {
  localStorage.setItem("projects", JSON.stringify(projects));
};

const displayTask = (project, index) => {
  const mainDiv = document.createElement('div');
  mainDiv.className = "project";
  const title = document.createElement('div');
  title.className = 'title';
  title.innerHTML = `<h3>${project.name}</h3><button class="delete_project">Delete</button>`;

  mainDiv.appendChild(title);
  mainDiv.appendChild(document.createElement('hr'));
  const taskContainer = document.createElement('table');
  mainDiv.appendChild(taskContainer);
  taskContainer.innerHTML = `<thead><tr><th>Title</th><th>Due Date</th><th>Actions</th></tr></thead>`
  const tbody = document.createElement('tbody');
  
  project.tasks.forEach(task => {
    const tr = document.createElement('tr');
    tr.className = index
    tr.innerHTML = `<td class="title">${task.title}</td><td>${task.dueDate}</td><td><button class="view">View</button><button class="edit">Edit</button><button class="delete">Delete</button></td>`;
    switch (task.priority) {
      case 'Low':
        tr.style.backgroundColor = 'green';
        break;
      case 'Medium':
        tr.style.backgroundColor = 'yellow';
        break;
      case 'High':
        tr.style.backgroundColor = 'red';
        break;
      default:
        break;
    }
    const view = document.createElement('dialog');
    view.id = `${task.title}-${index}`;
    view.innerHTML = `<button class="close">Close</button><div><h2 class="title">${task.title}</h2><div><h5>Description: </h5><p>${task.description}</p></div><h5>Due Date: ${task.dueDate}</h5><h5>Priority: ${task.priority}</h5><h5>Status: ${task.status ? "Complete" : "In-progress"} <button class="status">Change Status</button></h5></div>`;
    tr.appendChild(view);
    taskContainer.appendChild(tr);
    view.close();
  });

  const dialog = document.createElement('dialog');
  dialog.className = `${index}`;
  const closeButton = document.createElement('button');
  dialog.innerHTML = createTaskDialog(project.name);
  mainDiv.appendChild(dialog);
  mainDiv.innerHTML += `<button class="createtasks">Create</button>`
  dialog.close();
  return mainDiv;
};

const createTaskDialog = (name, title = '', description = '', dueDate = '', priority = '', status = '') => {
  return `
  <button class="close">Close</button>
  <input type="text" placeholder="Title" value="${title}" class="title"/>
  <textarea class="description">${description}</textarea>
  <input value="${dueDate}" type="date"  class="duedate"/>
  <label>Priority
  <select class="priority">
    <option selected value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
  </select>
  </label>
  <button class="create">Create</button>`
};
const display = () => {
  saveProjects();
  console.log(projects);
  container.innerHTML = ``;
  projects.forEach((project, index) => {
    container.appendChild(displayTask(project, index));
  });
  const deleteProjectButtons = document.querySelectorAll('.delete_project');
  const editButtons = document.querySelectorAll('.edit');
  const viewButtons = document.querySelectorAll('.view');
  const closeButtons = document.querySelectorAll('.close');
  const deleteButtons = document.querySelectorAll('.delete');
  const buttons = document.querySelectorAll('.createtasks');
  const createButtons = document.querySelectorAll('.create');
  const statusButtons = document.querySelectorAll('.status');

  statusButtons.forEach(button => {
    button.addEventListener('click', () => {
      const dialog = button.parentElement.parentElement.parentElement;
      projects[parseInt(dialog.id.split('-')[1])].findTask(dialog.querySelector('.title').textContent).changeStatus();
      saveProjects();
      display();
    });
  });

  deleteProjectButtons.forEach(button => {
    button.addEventListener('click', () => {
      const title = button.parentElement.querySelector('h3').textContent;
      deleteProject(title);
      saveProjects();
      display();
    });
  });
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const dialog = document.createElement('dialog');
      const tr = button.parentElement.parentElement;
      const t = tr.querySelector('.title').textContent;
      const task = projects[parseInt(tr.className)].findTask(t);
      dialog.innerHTML = createTaskDialog(projects[parseInt(tr.className)].name, t, task.description, task.dueDate, task.priority, task.status);
      tr.appendChild(dialog);
      dialog.showModal();

      dialog.querySelectorAll('button').forEach(el => {
        el.addEventListener('click', () => {
          if (el.textContent === "Create")
          {
            const title = dialog.querySelector('.title');
            const description = dialog.querySelector('.description');
            const duedate = dialog.querySelector('.duedate')
            const priority = dialog.querySelector('.priority');

            projects[parseInt(tr.className)].findTask(t).editTask(title.value, description.value, duedate.value, priority.value);
          }
          tr.removeChild(dialog);
          saveProjects;
          display();
        });
      });
    });
  });

  viewButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tr = button.parentElement.parentElement;
      const title = tr.querySelector('.title').textContent;
      const dialog = document.getElementById(`${title}-${tr.className}`);
      dialog.showModal();
    });
  });
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      button.parentElement.close();
    });
  });

  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tr = button.parentElement.parentElement;
      const title = tr.querySelector('.title');
      projects[parseInt(tr.className)].removeTask(title.textContent);
      saveProjects();
      display();
    });
  });
  
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const dialogs = button.parentElement.querySelectorAll('dialog');
        dialogs[dialogs.length - 1].showModal()
    });
  });

  createButtons.forEach(button => {
    button.addEventListener('click', () => {
      const dialog = button.parentElement;
      const title = dialog.querySelector('.title');
      const description = dialog.querySelector('.description');
      const duedate = dialog.querySelector('.duedate');
      const priority = dialog.querySelector('.priority');
      const newTask = new Task(title.value, description.value, duedate.value, priority.value);
      if (!title.value) return;

      projects[parseInt(dialog.className)].addTask(newTask);
      saveProjects();
      dialog.close();
      display();
    });
  });
};


display();
