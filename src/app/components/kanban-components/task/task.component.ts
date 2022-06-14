import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Subscription, takeUntil, Subject, concatMap, Observable, from} from 'rxjs';

import {UserService} from '../../../services/user.service';
import {TaskService} from '../../../services/task.service';

import {TaskUpdateComponent} from '../../../modals/task-update/task-update.component';
import {DeleteConfirmComponent} from '../../../modals/delete-confirm/delete-confirm.component';

import {BoardResponse} from '../../../models/board-response';
import {ColumnResponse} from '../../../models/column-response';
import {TaskResponse} from '../../../models/task-response';
import {TaskRequest} from '../../../models/task-request';
import {UserResponse} from '../../../models/user-response';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, OnDestroy {

  @Input()
  boardResponse: BoardResponse = new BoardResponse();
  @Input()
  columnResponse: ColumnResponse = new ColumnResponse();
  @Input()
  taskResponseArray: TaskResponse[] = [];
  @Input()
  taskResponse: TaskResponse = new TaskResponse();

  userResponseArray: UserResponse[] = [];
  userResponse: UserResponse = new UserResponse();

  taskSubscription: Subscription = new Subscription;
  taskNotifier: Subject<void> = new Subject();

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private matDialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.userResponseArray = this.userService.users;
    this.findUserById();
    this.taskResponseArray.sort((
      previousTask: TaskResponse,
      nextTask: TaskResponse): number => {
      return previousTask.order - nextTask.order
    })
  }

  ngOnDestroy(): void {
  }

  findUserById(): void {
    this.userService.users
      .find((userResponse: UserResponse) => {
        if (userResponse.id === this.taskResponse.userId) {
          this.userResponse.name = userResponse.name
        } // добавить else!!!
      });
  }

  updateTask(updatedTaskRequest: TaskRequest): void {
    updatedTaskRequest.boardId = this.boardResponse.id
    updatedTaskRequest.columnId = this.columnResponse.id
    this.taskSubscription = this.taskService
      .updateTask(this.boardResponse.id, this.columnResponse.id, this.taskResponse.id, updatedTaskRequest)
      .pipe(
        takeUntil(this.taskNotifier)
      )
      .subscribe((updatedTaskResponse: TaskResponse) => {
        this.taskResponse.title = updatedTaskResponse.title
        this.taskResponse.done = updatedTaskResponse.done
        this.taskResponse.description = updatedTaskResponse.description
        this.taskResponse.userId = updatedTaskResponse.userId
      })
  }

  deleteTask(): void {
    const changeTaskOrderArray: TaskResponse[] = [];
    const deletedTaskIndex: number = this.taskResponseArray.indexOf(this.taskResponse)

    for (let i = deletedTaskIndex + 1; i <= (this.taskResponseArray.length - 1); i++) {

      const taskResponse: TaskResponse = JSON.parse(JSON.stringify(this.taskResponseArray[i]))
      taskResponse.order -= 1
      changeTaskOrderArray.push(taskResponse)
    }

    this.taskSubscription = this.taskService
      .deleteTask(this.boardResponse.id, this.columnResponse.id, this.taskResponse.id)
      .pipe(
        takeUntil(this.taskNotifier)
      )
      .subscribe(() => {
          this.taskResponseArray.splice(deletedTaskIndex, 1)
          this.changeTasksOrder(this.columnResponse.id, changeTaskOrderArray)
            .subscribe((changedTaskResponse: TaskResponse) => {
              this.taskResponseArray.find((taskResponse: TaskResponse) => {
                if (changedTaskResponse.id === taskResponse.id) {
                  taskResponse.order = changedTaskResponse.order
                }
              })
            })
        }
      )
  }

  updateTaskModal(taskResponse: TaskResponse): void {
    const taskDialogConfig = new MatDialogConfig();

    taskDialogConfig.disableClose = true;
    taskDialogConfig.autoFocus = false;

    taskDialogConfig.data = taskResponse

    const taskDialogRef = this.matDialog.open(TaskUpdateComponent, taskDialogConfig)

    taskDialogRef.afterClosed().subscribe(
      (taskRequest: TaskRequest) => {
        if (taskRequest !== undefined) {
          this.updateTask(taskRequest)
        }
      }
    )
  }

  deleteTaskModal(): void {
    const deleteColumnDialogConfig = new MatDialogConfig();

    deleteColumnDialogConfig.disableClose = true;
    deleteColumnDialogConfig.autoFocus = false;

    const deleteColumnDialogRef = this.matDialog.open(DeleteConfirmComponent, deleteColumnDialogConfig)

    deleteColumnDialogRef.afterClosed().subscribe(
      (deleteConfirm: boolean) => {
        if (deleteConfirm) {
          this.deleteTask()
        }
      }
    )
  }

  changeTasksOrder(columnId: string, changeOrderArray: TaskResponse[]): Observable<TaskResponse> {
    return from(changeOrderArray).pipe(
      takeUntil(this.taskNotifier),
      concatMap((response: TaskResponse) => this.taskService.updateTaskOrder(this.boardResponse.id, columnId, response))
    )
  }
}
