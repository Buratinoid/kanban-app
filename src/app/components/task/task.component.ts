import { Component, Input, OnInit } from '@angular/core';
import { Board } from '../../models/board';
import { Column } from '../../models/column';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input()
  task!: Task;

  @Input()
  column!: Column;

  @Input()
  board!: Board;

  tasks!: Task[];

  constructor() { }

  ngOnInit() {

  }

}
