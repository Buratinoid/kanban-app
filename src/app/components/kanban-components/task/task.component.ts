import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {takeUntil, Subject, concatMap, Observable, from} from 'rxjs';

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
  board: BoardResponse = new BoardResponse();
  @Input()
  column: ColumnResponse = new ColumnResponse();
  @Input()
  tasksArray: TaskResponse[] = [];
  @Input()
  task: TaskResponse = new TaskResponse();

  user: UserResponse = new UserResponse();
  usersArray: UserResponse[] = [];

  taskNotifier: Subject<void> = new Subject();

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private matDialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.usersArray = this.userService.users;
    this.findUserById();
    this.tasksArray.sort((a: TaskResponse, b: TaskResponse): number => {
      return a.order - b.order
    })
  }

  ngOnDestroy(): void {
  }

  findUserById(): void {
    this.userService.users
      .find((userResponse: UserResponse) => {
        if (userResponse.id === this.task.userId) {
          this.user.name = userResponse.name
        }
      });
  }

  updateTask(updatedTaskRequest: TaskRequest): void {
    updatedTaskRequest.boardId = this.board.id
    updatedTaskRequest.columnId = this.column.id
    this.taskService.updateTask(this.board.id, this.column.id, this.task.id, updatedTaskRequest)
      .pipe(
        takeUntil(this.taskNotifier)
      )
      .subscribe((updatedTaskResponse: TaskResponse) => {
        this.task = updatedTaskResponse
        this.findUserById()
      })
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

  deleteTask(): void {
    const changeTaskOrderArray: TaskResponse[] = [];
    const deletedTaskIndex: number = this.tasksArray.indexOf(this.task)

    for (let i = deletedTaskIndex + 1; i <= (this.tasksArray.length - 1); i++) {

      const taskResponse: TaskResponse = JSON.parse(JSON.stringify(this.tasksArray[i]))
      taskResponse.order -= 1
      changeTaskOrderArray.push(taskResponse)
    }

    this.taskService.deleteTask(this.board.id, this.column.id, this.task.id)
      .pipe(
        takeUntil(this.taskNotifier)
      )
      .subscribe(() => {
          this.tasksArray.splice(deletedTaskIndex, 1)
          this.changeTasksOrder(this.column.id, changeTaskOrderArray)
            .subscribe((changedTaskResponse: TaskResponse) => {
              this.tasksArray.find((taskResponse: TaskResponse) => {
                if (changedTaskResponse.id === taskResponse.id) {
                  taskResponse.order = changedTaskResponse.order
                }
              })
            })
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
      concatMap((response: TaskResponse) => this.taskService.updateTaskOrder(this.board.id, columnId, response))
    )
  }
}
