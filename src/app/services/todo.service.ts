import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter } from '../models/filtering.model';
import { Todo } from '../models/todo.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private static readonly TodoStorageKey = 'todo';

  private todo!: Todo[];
  private filteredTodo!: Todo[];
  private lengthSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private displayTodoSubject: BehaviorSubject<Todo[]>= new BehaviorSubject<Todo[]>([]);
  private currentFilter: Filter = Filter.All;

  todo$: Observable<Todo[]> =this.displayTodoSubject.asObservable();
  length$: Observable<number> =this.lengthSubject.asObservable();

  constructor(private storageService: LocalStorageService) {}

  fetchFromLocalStorage() {
    this.todo = this.storageService.getValue<Todo[]>(TodoService.TodoStorageKey) || [];
    this.filteredTodo = [...this.todo.map(todo => ({...todo}))];
    this.updateTodoData();
  }

  updateToLocalStorage() {
    this.storageService.setObject(TodoService.TodoStorageKey, this.todo);
    this.filterTodo(this.currentFilter, false);
    this.updateTodoData();
  }

  addTodo (content: string) {
    const date = new Date(Date.now()).getTime();
    const newTodo = new Todo(date, content);
    this.todo.unshift(newTodo);
    this.updateToLocalStorage();
  }

  changeTodoStatus (id: number, isCompleted: boolean) {
    const index = this.todo.findIndex( t => t.id === id);
    const todos =this.todo[index];
    todos.isCompleted = isCompleted;
    this.todo.splice(index, 1, todos);
    this.updateToLocalStorage();
  }

  editTodo(id: number, content: string) {
    const index = this.todo.findIndex( t => t.id === id);
    const todos =this.todo[index];
    todos.content = content;
    this.todo.splice(index, 1, todos);
  }

  deleteTodo(id:number) {
    const index = this.todo.findIndex( t => t.id === id);
    this.todo.splice(index, 1);
    this.updateToLocalStorage();
  }

  toggleAll() {
    this.todo = this.todo.map(todos => {
      return {
        ...todos,
        isCompleted: !this.todo.every(t => t.isCompleted)
      };
    });
    this.updateToLocalStorage();
  }

  clearCompleted() {
    this.todo = this.todo.filter(todos => !todos.isCompleted);
    this.updateToLocalStorage();
  }


  filterTodo(filter:Filter, isFiltering:boolean=true) {
    this.currentFilter=filter;
    switch (filter) {
      case Filter.Active:
        this.filteredTodo =  this.todo.filter(todo => !todo.isCompleted);
        break;
        case Filter.Completed:
        this.filteredTodo = this.todo.filter(todo => todo.isCompleted);
        break;
        case Filter.All:
        this.filteredTodo = [...this.todo.map(todo => ({...todo}))];
        break;
    }

    if (isFiltering) {
      this.updateTodoData();
    }
  }

  private updateTodoData() {
    this.displayTodoSubject.next(this.filteredTodo);
    this.lengthSubject.next(this.todo.length);
  }
}


