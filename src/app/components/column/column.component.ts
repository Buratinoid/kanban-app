import { TaskUpdateComponent } from './../../modals/task-update/task-update.component';
import { TaskAddComponent } from './../../modals/task-add/task-add.component';
import { Subscription, Subject, takeUntil } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import { BoardResponse } from 'src/app/models/board-response';
import {ColumnResponse} from '../../models/column-response';
import {TaskResponse} from '../../models/task-response';
import { TaskService } from 'src/app/services/task.service';
import { TaskRequest } from 'src/app/models/task-request';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css']
})
export class ColumnComponent implements OnInit, OnDestroy {

  @Input()
  column: ColumnResponse = new ColumnResponse();

  @Input()
  board: BoardResponse = new BoardResponse();

  tasks: TaskResponse[] = [];
  task: TaskResponse = new TaskResponse();

  columnSubscription: Subscription = new Subscription;

  columnNotifier: Subject<void> = new Subject();

  constructor(
    private taskService: TaskService,
    private newTaskDialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.tasks = this.column.tasks;
  }

  ngOnDestroy(): void {
    this.columnNotifier.next();
    this.columnNotifier.complete();
    this.columnSubscription.unsubscribe();
  }

  getAllTasks(): void {
    this.columnSubscription = this.taskService
    .getAllTasks(this.board.id, this.column.id)
    .pipe(
      takeUntil(this.columnNotifier)
    )
    .subscribe((tasks: TaskResponse[]) => this.tasks = tasks)
  }

  createTask(task: TaskRequest): void {
    this.columnSubscription = this.taskService
    .createTask(this.board.id, this.column.id, task)
    .pipe(
      takeUntil(this.columnNotifier)
    )
    .subscribe(() => {
      this.getAllTasks()
    })
  }

  deleteTask(taskId: string): void {
    this.columnSubscription = this.taskService
    .deleteTask(this.board.id, this.column.id, taskId)
    .pipe(
      takeUntil(this.columnNotifier)
    )
    .subscribe(() => {
      console.log(`Task ${taskId} deleted`)
      this.getAllTasks()
    })
  }

  updateTask(taskId: string, task: TaskRequest): void {
    this.columnSubscription = this.taskService
    .updateTask(this.board.id, this.column.id, taskId, task)
    .pipe(
      takeUntil(this.columnNotifier)
    )
    .subscribe(() => {
      this.getAllTasks()
    })
  }

  newTaskModal(): void {
    const newTaskDialogConfig = new MatDialogConfig();

    newTaskDialogConfig.disableClose = true;
    newTaskDialogConfig.autoFocus = false;

    const newTaskDialogRef = this.newTaskDialog.open(TaskAddComponent, newTaskDialogConfig)

    newTaskDialogRef.afterClosed().subscribe(
      (task: TaskRequest) => {
        if (task !== undefined) {
          this.createTask(task)
        }
      }
    )
  }

  updateTaskModal(taskId: string, task: TaskResponse): void {
    const updateTaskDialogConfig = new MatDialogConfig();

    updateTaskDialogConfig.disableClose = true;
    updateTaskDialogConfig.autoFocus = false;

    updateTaskDialogConfig.data = task

    const updateTaskDialogRef = this.newTaskDialog.open(TaskUpdateComponent, updateTaskDialogConfig)

    updateTaskDialogRef.afterClosed().subscribe(
      (task: TaskRequest) => {
        if (task !== undefined) {
          
            task.boardId = this.board.id,
            task.columnId = this.column.id
          
          this.updateTask(taskId, task)
        }
      }
    )
  }
}
