export default class Project {
  constructor(name) 
  {
    this.name = name;
    this.tasks = [];
  }

  addTask(task)
  {
    if (this.findTask(task.title)) return;
    this.tasks.push(task);
  }

  editName(newName)
  {
    this.name = newName;
  }

  removeTask(taskTitle)
  {
    if (this.tasks.length === 0) return false;
    this.tasks = this.tasks.filter(t => t.title !== taskTitle);
    return true;
  }

  findTask(taskTitle)
  {
    return this.tasks.find(t => t.title === taskTitle)
  }
}
