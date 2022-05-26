import { Subscription } from 'rxjs';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Board } from '../../models/board';
import { Column } from '../../models/column';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, OnDestroy {

  @Input()
  column!: Column;

  @Input()
  board!: Board;

  tasks!: Task[];

  taskSubscription: Subscription = new Subscription;

  constructor(private taskHttp: TaskService) { }

  ngOnInit(): void {
    this.taskSubscription = this.taskHttp
    .getAllTasks(this.board.id, this.column.id)
    .subscribe((tasks: Task[]) => this.tasks = tasks)
  }

  ngOnDestroy(): void {
    this.taskSubscription.unsubscribe()
  }
}