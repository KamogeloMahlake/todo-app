export default class Task {
  constructor(title, description, dueDate, priority, status = false) 
  {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = status;  
  }

  editTask(title, description, dueDate, priority)
  {
    this.title = title ?? this.title;
    this.description = description ?? this.description;
    this.dueDate = dueDate ?? this.dueDate;
    this.priority = priority ?? this.priority;
  }

  changeStatus()
  {
    this.status = !this.status;
  }
}
