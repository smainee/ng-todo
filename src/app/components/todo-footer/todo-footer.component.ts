import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Filter, FilterButton } from '../../models/filtering.model';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss']
})
export class TodoFooterComponent implements OnInit {

  filterButtons: FilterButton[] = [
    {type: Filter.All, lable: 'All', isActive: true},
    {type: Filter.Active, lable: 'Active', isActive: false},
    {type: Filter.Completed, lable: 'Completed', isActive: false},
  ];

  length =0;
  hasComplete$!: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.todoService.length$.pipe(takeUntil(this.destroy$)).subscribe(length => {
      this.length =length;
    });
  }

  filter(type: Filter) {
    this.setActiveFilterBtn(type);
    this.todoService.filterTodo(type);
  }

  private setActiveFilterBtn(type:Filter) {
    this.filterButtons.forEach(btn => {
      btn.isActive = btn.type === type;
    });
  }

  clearCompleted() {
    this.todoService.clearCompleted();
  }

  ngOnDestroy () {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
