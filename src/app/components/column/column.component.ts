import { DeleteConfirmComponent } from './../../modals/delete-confirm/delete-confirm.component';
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
  columnResponse: ColumnResponse = new ColumnResponse();

  @Input()
  boardResponse: BoardResponse = new BoardResponse();

  tasksResponse: TaskResponse[] = [];
  taskResponse: TaskResponse = new TaskResponse();

  columnSubscription: Subscription = new Subscription;

  columnNotifier: Subject<void> = new Subject();

  constructor(
    private taskService: TaskService,
    private matDialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.tasksResponse = this.columnResponse.tasks;
  }

  ngOnDestroy(): void {
    this.columnNotifier.next();
    this.columnNotifier.complete();
    this.columnSubscription.unsubscribe();
  }

  getAllTasks(): void {
    this.columnSubscription = this.taskService
    .getAllTasks(this.boardResponse.id, this.columnResponse.id)
    .pipe(
      takeUntil(this.columnNotifier)
    )
    .subscribe((tasks: TaskResponse[]) => this.tasksResponse = tasks)
  }

  createTask(taskRequest: TaskRequest): void {
    this.columnSubscription = this.taskService
    .createTask(this.boardResponse.id, this.columnResponse.id, taskRequest)
    .pipe(
      takeUntil(this.columnNotifier)
    )
    .subscribe(() => {
      this.getAllTasks()
    })
  }

  deleteTask(taskId: string): void {
    this.columnSubscription = this.taskService
    .deleteTask(this.boardResponse.id, this.columnResponse.id, taskId)
    .pipe(
      takeUntil(this.columnNotifier)
    )
    .subscribe(() => {
      console.log(`Task ${taskId} deleted`)
      this.getAllTasks()
    })
  }

  updateTask(taskId: string, taskRequest: TaskRequest): void {
    this.columnSubscription = this.taskService
    .updateTask(this.boardResponse.id, this.columnResponse.id, taskId, taskRequest)
    .pipe(
      takeUntil(this.columnNotifier)
    )
    .subscribe(() => {
      this.getAllTasks()
    })
  }

  newTaskModal(): void {
    const newTaskMatDialogConfig = new MatDialogConfig();

    newTaskMatDialogConfig.disableClose = true;
    newTaskMatDialogConfig.autoFocus = false;

    const newTaskMatDialogRef = this.matDialog.open(TaskAddComponent, newTaskMatDialogConfig)

    newTaskMatDialogRef.afterClosed().subscribe(
      (taskRequest: TaskRequest) => {
        if (taskRequest !== undefined) {
          this.createTask(taskRequest)
        }
      }
    )
  }

  updateTaskModal(taskId: string, taskResponse: TaskResponse): void {
    const updateTaskDialogConfig = new MatDialogConfig();

    updateTaskDialogConfig.disableClose = true;
    updateTaskDialogConfig.autoFocus = false;

    updateTaskDialogConfig.data = taskResponse

    const updateTaskDialogRef = this.matDialog.open(TaskUpdateComponent, updateTaskDialogConfig)

    updateTaskDialogRef.afterClosed().subscribe(
      (taskRequest: TaskRequest) => {
        if (taskRequest !== undefined) {
          
            taskRequest.boardId = this.boardResponse.id,
            taskRequest.columnId = this.columnResponse.id
          
          this.updateTask(taskId, taskRequest)
        }
      }
    )
  }

  deleteTaskModal(taskId: string): void {
    const deleteColumnDialogConfig = new MatDialogConfig();

    deleteColumnDialogConfig.disableClose = true;
    deleteColumnDialogConfig.autoFocus = false;

    const deleteColumnDialogRef = this.matDialog.open(DeleteConfirmComponent, deleteColumnDialogConfig)

    deleteColumnDialogRef.afterClosed().subscribe(
      (deleteConfirm: boolean) => {
        if (deleteConfirm === true) {
          this.deleteTask(taskId)
        }
      }
    )
  }
}
