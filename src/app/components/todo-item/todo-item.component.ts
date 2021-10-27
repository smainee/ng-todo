import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Todo } from 'src/app/models/todo.model';


@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {

  @Input() todos!: Todo;
  @Output() changeStatus: EventEmitter<Todo> =new EventEmitter<Todo> ();
  @Output() editTodo: EventEmitter<Todo> =new EventEmitter<Todo> ();
  @Output() deleteTodo: EventEmitter<Todo> =new EventEmitter<Todo> ();

  isHovered = false;
  isEditing =false ;

  constructor() { }

  ngOnInit(): void {
  }

  submitEdit(event: KeyboardEvent) {
    const {keyCode} = event;
    event.preventDefault();
    if (keyCode === 13) {
      this.editTodo.emit(this.todos);
      this.isEditing = false;
    }
  }

  changeTodoStatus() {
    this.changeStatus.emit({...this.todos, isCompleted: !this.todos.isCompleted});
  }

  removeTodo() {
    this.deleteTodo.emit(this.todos);

  }
}
