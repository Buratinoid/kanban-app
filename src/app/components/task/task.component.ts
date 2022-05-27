import { Subscription } from 'rxjs';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { BoardResponce } from '../../models/board-responce';
import { ColumnResponce } from '../../models/column-responce';
import { TaskResponce } from '../../models/task-responce';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, OnDestroy {

  @Input()
  column!: ColumnResponce;

  @Input()
  board!: BoardResponce;

  tasks!: TaskResponce[];

  taskSubscription: Subscription = new Subscription;

  constructor(private taskHttp: TaskService) { }

  ngOnInit(): void {
    this.taskSubscription = this.taskHttp
    .getAllTasks(this.board.id, this.column.id)
    .subscribe((tasks: TaskResponce[]) => this.tasks = tasks)
  }

  ngOnDestroy(): void {
    this.taskSubscription.unsubscribe()
  }
}