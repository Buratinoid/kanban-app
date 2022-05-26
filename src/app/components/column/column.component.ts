import { Component, Input, OnInit } from '@angular/core';
import { Board } from '../../models/board';
import { Column } from '../../models/column';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css']
})
export class ColumnComponent implements OnInit {

  @Input()
  column!: Column;

  @Input()
  board!: Board;

  tasks!: Task[];

  constructor(private http: TaskService) { }

  ngOnInit() {
  }

}
