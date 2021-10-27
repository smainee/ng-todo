import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from 'src/app/models/todo.model';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  todo$!: Observable<Todo[]>;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {

    this.todo$ = this.todoService.todo$;
  }

  onChangeTodoStatus(todos:Todo) {
    this.todoService.changeTodoStatus(todos.id, todos.isCompleted);
  }

  onEditTodo(todos: Todo) {
    this.todoService.editTodo(todos.id, todos.content);

  }

  onDeleteTodo(todos: Todo) {
    this.todoService.deleteTodo(todos.id)
  }
}
