import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ColumnResponce } from '../../models/column-responce';
import { TaskResponce } from './../../models/task-responce';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css']
})
export class ColumnComponent implements OnInit, OnDestroy {
  
  @Input()
  column!: ColumnResponce;
  
  tasks!: TaskResponce[];
  task!: TaskResponce;
  
  constructor() { }
  
  ngOnInit(): void {
    this.tasks = this.column.tasks;
  }

  ngOnDestroy(): void {
  }
}