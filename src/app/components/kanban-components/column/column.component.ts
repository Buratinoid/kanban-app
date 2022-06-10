import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Subscription, Subject, takeUntil, concatMap, Observable, from} from 'rxjs';

import {ColumnService} from '../../../services/column.service';
import {TaskService} from '../../../services/task.service';

import {DeleteConfirmComponent} from '../../../modals/delete-confirm/delete-confirm.component';
import {TaskAddComponent} from '../../../modals/task-add/task-add.component';

import {BoardResponse} from '../../../models/board-response';
import {ColumnResponse} from '../../../models/column-response';
import {ColumnRequest} from '../../../models/column-request';
import {TaskResponse} from '../../../models/task-response';
import {TaskRequest} from '../../../models/task-request';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css']
})
export class ColumnComponent implements OnInit, OnDestroy {

  @Input()
  boardResponse: BoardResponse = new BoardResponse();
  @Input()
  columnResponse: ColumnResponse = new ColumnResponse();
  @Input()
  columnResponseArray: ColumnResponse[] = [];

  taskResponseArray: TaskResponse[] = [];

  private _editColumnTitleCondition: boolean = true;

  editColumnTitleForm: FormGroup;

  columnSubscription: Subscription = new Subscription;
  columnNotifier: Subject<void> = new Subject();

  constructor(
    private httpService: HttpClient,
    private columnService: ColumnService,
    private taskService: TaskService,
    private matDialog: MatDialog
  ) {
    this.editColumnTitleForm = new FormGroup({
      title: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    this.columnResponseArray.sort((
      previousColumn: ColumnResponse,
      nextColumn: ColumnResponse): number => {
      return previousColumn.order - nextColumn.order
    })
    this.taskResponseArray = this.columnResponse.tasks;
  }

  ngOnDestroy(): void {
    this.columnNotifier.next();
    this.columnNotifier.complete();
    this.columnSubscription.unsubscribe();
  }

  editColumnTitle(): void {
    this.editColumnTitleForm.setValue({title: this.columnResponse.title})
  }

  updateColumnTitle(): void {
    if (this.columnResponse.title !== this.editColumnTitleForm.value.title) {
      const columnRequest: ColumnRequest = {
        title: this.editColumnTitleForm.value.title,
        order: this.columnResponse.order
      }
      this.columnSubscription = this.columnService
        .updateColumn(this.boardResponse.id, this.columnResponse.id, columnRequest)
        .pipe(
          takeUntil(this.columnNotifier)
        )
        .subscribe((columnResponse: ColumnResponse) => {
          this.columnResponse.title = columnResponse.title
        })
    }
  }

  deleteColumn(): void {
    const changeColumnOrderArray: ColumnResponse[] = [];
    const deletedColumnIndex: number = this.columnResponseArray.indexOf(this.columnResponse)

    for (let i = deletedColumnIndex + 1; i <= (this.columnResponseArray.length - 1); i++) {

      const changedColumnResponse: ColumnResponse = JSON.parse(JSON.stringify(this.columnResponseArray[i]))
      changedColumnResponse.order -= 1
      changeColumnOrderArray.push(changedColumnResponse)
    }

    this.columnSubscription = this.columnService
      .deleteColumn(this.boardResponse.id, this.columnResponse.id)
      .pipe(
        takeUntil(this.columnNotifier)
      )
      .subscribe(() => {
        this.columnResponseArray.splice(deletedColumnIndex, 1)
        this.changeColumnsOrder(changeColumnOrderArray)
          .subscribe((changedColumnResponse: ColumnResponse) => {
            this.columnResponseArray.find((columnResponse: ColumnResponse) => {
              if (changedColumnResponse.id === columnResponse.id) {
                columnResponse.order = changedColumnResponse.order
              }
            })
          })
      })
  }

  deleteColumnModal(): void {
    const deleteColumnDialogConfig = new MatDialogConfig();

    deleteColumnDialogConfig.disableClose = true;
    deleteColumnDialogConfig.autoFocus = false;

    const deleteColumnDialogRef = this.matDialog.open(DeleteConfirmComponent, deleteColumnDialogConfig)

    deleteColumnDialogRef.afterClosed().subscribe(
      (deleteConfirm: boolean) => {
        if (deleteConfirm) {
          this.deleteColumn()
        }
      }
    )
  }

  updateColumnOrder(updatedColumnId: string, updatedColumnRequest: ColumnRequest): void {
    this.columnSubscription = this.columnService
      .updateColumn(this.boardResponse.id, updatedColumnId, updatedColumnRequest)
      .pipe(
        takeUntil(this.columnNotifier)
      )
      .subscribe((updatedColumnResponse: ColumnResponse) => {

        this.columnResponseArray.find((columnResponse: ColumnResponse) => {
          if (updatedColumnId === columnResponse.id) {
            columnResponse.order = updatedColumnResponse.order
          }
        })
      })
  }

  addTask(taskRequest: TaskRequest): void {
    const increaseTaskOrder: number = 1;
    // Где потерял массив???
    if (this.taskResponseArray === undefined || this.taskResponseArray.length === 0) {
      this.taskResponseArray = []
      taskRequest.order = increaseTaskOrder
    } else {
      const lastTaskIndex: number = this.taskResponseArray.length - 1
      taskRequest.order = this.taskResponseArray[lastTaskIndex].order + increaseTaskOrder
    }
    this.columnSubscription = this.taskService
      .createTask(this.boardResponse.id, this.columnResponse.id, taskRequest)
      .pipe(
        takeUntil(this.columnNotifier)
      )
      .subscribe((taskResponse: TaskResponse) => {
        this.taskResponseArray.push(taskResponse)
      })
  }

  addTaskModal(): void {
    const newTaskMatDialogConfig = new MatDialogConfig();

    newTaskMatDialogConfig.disableClose = true;
    newTaskMatDialogConfig.autoFocus = false;

    const newTaskMatDialogRef = this.matDialog.open(TaskAddComponent, newTaskMatDialogConfig)

    newTaskMatDialogRef.afterClosed().subscribe(
      (taskRequest: TaskRequest) => {
        if (taskRequest !== undefined) {
          this.addTask(taskRequest)
        }
      }
    )
  }

  addMovedTask(deletedTask: TaskResponse): void {
    const taskRequest: TaskRequest = {
      title: deletedTask.title,
      done: deletedTask.done,
      order: deletedTask.order,
      description: deletedTask.description,
      userId: deletedTask.userId
    }
    this.columnSubscription = this.taskService
      .createTask(this.boardResponse.id, this.columnResponse.id, taskRequest)
      .pipe(
        takeUntil(this.columnNotifier)
      )
      .subscribe((taskResponse: TaskResponse) => {
        this.taskResponseArray.find((task: TaskResponse) => {
          if (task.id === deletedTask.id) {
            task.id = taskResponse.id
            task.order = taskResponse.order
          }
        })
      })
  }

  deleteMovedTask(columnId: string, taskId: string): void {
    this.columnSubscription = this.taskService
      .deleteTask(this.boardResponse.id, columnId, taskId)
      .pipe(
        takeUntil(this.columnNotifier)
      )
      .subscribe(() => {
        console.log('Task in prev Column deleted!'); //???
      })
  }

  dropTask(event: CdkDragDrop<TaskResponse[]>): void {
    const columnResponseArrayForDeleteTask: ColumnResponse[] = JSON.parse(JSON.stringify(this.columnResponseArray))

    const movedTask: TaskResponse = this.taskResponseArray[event.previousIndex]
    const movedTaskIndex: number = JSON.parse(JSON.stringify(event.currentIndex))
    let deletedTaskColumnId = ''

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    //Если перемещение МЕЖДУ колонками
    if (event.container.data !== event.previousContainer.data) {

      const currentTaskArray: TaskResponse[] = event.container.data
      const deletedTask: TaskResponse = JSON.parse(JSON.stringify(event.container.data[movedTaskIndex]))

      //Поиск Id колонки из которой удалён Task
      columnResponseArrayForDeleteTask.forEach((column: ColumnResponse) => {
        column.tasks.forEach((task: TaskResponse) => {
          if (task.id === deletedTask.id) {

            deletedTaskColumnId = column.id
          }
        })
      })

      currentTaskArray[movedTaskIndex].order = movedTaskIndex + 1

      const changeTaskOrderCurrentColumnArray: TaskResponse[] = []
      for (let i = movedTaskIndex + 1; i <= currentTaskArray.length - 1; i++) {
        const taskResponse: TaskResponse = JSON.parse(JSON.stringify(currentTaskArray[i]))
        taskResponse.order += 1
        changeTaskOrderCurrentColumnArray.push(taskResponse)
      }

      const previousTaskArray: TaskResponse[] = event.previousContainer.data
      const previousTaskIndex: number = event.previousIndex

      const changeTaskOrderPrevColumnArray: TaskResponse[] = []
      for (let i = previousTaskIndex; i <= previousTaskArray.length - 1; i++) {
        const taskResponse: TaskResponse = JSON.parse(JSON.stringify(previousTaskArray[i]))
        taskResponse.order -= 1
        changeTaskOrderPrevColumnArray.push(taskResponse)
      }

      this.addMovedTask(currentTaskArray[movedTaskIndex]);
      this.deleteMovedTask(deletedTaskColumnId, deletedTask.id)

      this.changeTasksOrder(deletedTaskColumnId, changeTaskOrderPrevColumnArray)
        .subscribe((changedTaskResponse: TaskResponse) => {
          this.columnResponseArray.find((columnResponse: ColumnResponse) => {
            if (deletedTaskColumnId === columnResponse.id) {
              columnResponse.tasks.find((taskResponse: TaskResponse) => {
                if (changedTaskResponse.id === taskResponse.id) {
                  taskResponse.order = changedTaskResponse.order
                }
              })
            }
          })
        })

      this.changeTasksOrder(this.columnResponse.id, changeTaskOrderCurrentColumnArray)
        .subscribe((changedTaskResponse: TaskResponse) => {
          this.taskResponseArray.find((taskResponse: TaskResponse) => {
            if (changedTaskResponse.id === taskResponse.id) {
              taskResponse.order = changedTaskResponse.order
            }
          })
        })

    } else { //Если перемещение ВНУТРИ колонки
      const requestArray: TaskResponse[] = [];
      const index: number = this.taskResponseArray.findIndex((value: TaskResponse) => value.id === movedTask.id);
      const order: number = movedTask.order;

      if (index >= order) {

        for (let i: number = order - 1; i < index; i++) {
          const taskResponse: TaskResponse = JSON.parse(JSON.stringify(this.taskResponseArray[i]))
          taskResponse.order -= 1
          requestArray.push(taskResponse)
        }
      } else {

        for (let i: number = order - 1; i > index; i--) {
          const taskResponse: TaskResponse = JSON.parse(JSON.stringify(this.taskResponseArray[i]))
          taskResponse.order += 1
          requestArray.push(taskResponse)
        }
      }
      movedTask.order = index + 1;
      requestArray.push(movedTask)

      this.changeTasksOrder(this.columnResponse.id, requestArray)
        .subscribe((changedTaskResponse: TaskResponse) => {
          this.taskResponseArray.find((taskResponse: TaskResponse) => {
            if (changedTaskResponse.id === taskResponse.id) {
              taskResponse.order = changedTaskResponse.order
            }
          })
        })
    }

  }

  changeTasksOrder(columnId: string, changeOrderArray: TaskResponse[]): Observable<TaskResponse> {
    return from(changeOrderArray).pipe(
      takeUntil(this.columnNotifier),
      concatMap((response: TaskResponse) => this.taskService.updateTaskOrder(this.boardResponse.id, columnId, response))
    )
  }

  changeColumnsOrder(changeOrderArray: ColumnResponse[]): Observable<ColumnResponse> {
    return from(changeOrderArray).pipe(
      takeUntil(this.columnNotifier),
      concatMap((columnResponse: ColumnResponse) => this.columnService.updateColumnOrder(this.boardResponse.id, columnResponse))
    )
  }

  public getEditColumnCondition(): boolean {
    return this._editColumnTitleCondition
  }

  public changeEditColumnCondition(): void {
    this._editColumnTitleCondition = !this._editColumnTitleCondition;
  }
}
