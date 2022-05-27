import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ColumnResponse } from '../../models/column-response';
import { TaskResponse } from '../../models/task-response';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css']
})
export class ColumnComponent implements OnInit, OnDestroy {
  
  @Input()
  column!: ColumnResponse;
  
  tasks!: TaskResponse[];
  task!: TaskResponse;
  
  constructor() { }
  
  ngOnInit(): void {
    this.tasks = this.column.tasks;
  }

  ngOnDestroy(): void {
  }
}