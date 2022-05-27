import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { TaskResponse } from '../../models/task-response';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, OnDestroy {

  @Input()
  task!: TaskResponse;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}