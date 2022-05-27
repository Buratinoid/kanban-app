import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { TaskResponce } from '../../models/task-responce';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, OnDestroy {

  @Input()
  task!: TaskResponce;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}