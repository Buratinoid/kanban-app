import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription, takeUntil, Subject } from 'rxjs';

import {UserService} from '../../../services/user.service';
import { TaskService } from './../../../services/task.service';

import { TaskUpdateComponent } from './../../../modals/task-update/task-update.component';
import { DeleteConfirmComponent } from './../../../modals/delete-confirm/delete-confirm.component';

import { BoardResponse } from './../../../models/board-response';
import { ColumnResponse } from './../../../models/column-response';
import {TaskResponse} from '../../../models/task-response';
import { TaskRequest } from './../../../models/task-request';
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
  }

  ngOnDestroy(): void {
  }

  findUserById(): void {
    this.userService.users
    .find((userResponse: UserResponse) => {
      if(userResponse.id === this.taskResponse.userId) {
        this.userResponse = userResponse
      } // добавить else!!!
    });
  }

//   getAllTasks(): void {
//     this.taskSubscription = this.taskService
//         .getAllTasks(this.boardResponse.id, this.columnResponse.id)
//         .pipe(
//             takeUntil(this.taskNotifier)
//         )
//         .subscribe((tasks: TaskResponse[]) => this.tasksResponse = tasks)
// }

  updateTask(taskRequest: TaskRequest): void {
      this.taskSubscription = this.taskService
          .updateTask(this.boardResponse.id, this.columnResponse.id, this.taskResponse.id, taskRequest)
          .pipe(
              takeUntil(this.taskNotifier)
          )
          .subscribe(() => {
              // this.getAllTasks()
          })
  }

  deleteTask(): void {
    this.taskSubscription = this.taskService
        .deleteTask(this.boardResponse.id, this.columnResponse.id, this.taskResponse.id)
        .pipe(
            takeUntil(this.taskNotifier)
        )
        .subscribe(() => {
            // this.getAllTasks()
        })
  }

  updateTaskModal(taskResponse: TaskResponse): void {
    const updateTaskDialogConfig = new MatDialogConfig();

    updateTaskDialogConfig.disableClose = true;
    updateTaskDialogConfig.autoFocus = false;

    updateTaskDialogConfig.data = taskResponse

    const updateTaskDialogRef = this.matDialog.open(TaskUpdateComponent, updateTaskDialogConfig)

    updateTaskDialogRef.afterClosed().subscribe(
        (taskRequest: TaskRequest) => {
            if (taskRequest !== undefined) {

                taskRequest.boardId = this.boardResponse.id
                taskRequest.columnId = this.columnResponse.id

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
}
