import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Subject, takeUntil, concatMap, from} from 'rxjs';

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
  board: BoardResponse = new BoardResponse();
  @Input()
  column: ColumnResponse = new ColumnResponse();
  @Input()
  columnsArray: ColumnResponse[] = [];

  tasksArray: TaskResponse[] = [];

  editColumnTitleForm: FormGroup;

  columnNotifier: Subject<void> = new Subject();

  constructor(
    private matDialog: MatDialog,
    private columnService: ColumnService,
    private taskService: TaskService
  ) {
    this.editColumnTitleForm = new FormGroup({
      title: new FormControl(this.column.title, [Validators.required])
    })
  }

  ngOnInit(): void {
    this.columnsArray.sort((a: ColumnResponse, b: ColumnResponse): number => {
      return a.order - b.order
    })
    this.tasksArray = this.column.tasks;
  }

  ngOnDestroy(): void {
    this.columnNotifier.next();
    this.columnNotifier.complete();
  }

  editColumnTitle(): void {
    this.editColumnTitleForm.setValue({title: this.column.title})
  }

  updateColumnTitle(): void {
    if (this.column.title !== this.editColumnTitleForm.value.title && this.editColumnTitleForm.valid) {
      const columnRequest: ColumnRequest = {
        title: this.editColumnTitleForm.value.title,
        order: this.column.order
      }
      this.columnService.updateColumn(this.board.id, this.column.id, columnRequest)
        .pipe(
          takeUntil(this.columnNotifier)
        )
        .subscribe((columnResponse: ColumnResponse) => {
          this.column.title = columnResponse.title
        })
    }
  }

  deleteColumn(): void {
    const changeColumnOrderArray: ColumnResponse[] = [];
    const deletedColumnIndex: number = this.columnsArray.indexOf(this.column)

    for (let i = deletedColumnIndex + 1; i <= (this.columnsArray.length - 1); i++) {

      const changedColumnResponse: ColumnResponse = JSON.parse(JSON.stringify(this.columnsArray[i]))
      changedColumnResponse.order -= 1
      changeColumnOrderArray.push(changedColumnResponse)
    }

    this.columnService.deleteColumn(this.board.id, this.column.id)
      .pipe(
        takeUntil(this.columnNotifier)
      )
      .subscribe(() => {
        this.columnsArray.splice(deletedColumnIndex, 1)
        this.changeColumnsOrder(changeColumnOrderArray)
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
    this.columnService.updateColumn(this.board.id, updatedColumnId, updatedColumnRequest)
      .pipe(
        takeUntil(this.columnNotifier)
      )
      .subscribe((updatedColumnResponse: ColumnResponse) => {
        this.columnsArray.find((columnResponse: ColumnResponse) => {
          if (updatedColumnId === columnResponse.id) {
            columnResponse.order = updatedColumnResponse.order
          }
        })
      })
  }

  addTask(taskRequest: TaskRequest): void {
    if (this.tasksArray === undefined || this.tasksArray.length === 0) {
      this.tasksArray = []
      taskRequest.order = 1
    } else {
      const lastTaskIndex: number = this.tasksArray.length - 1
      taskRequest.order = this.tasksArray[lastTaskIndex].order + 1
    }
    this.taskService.createTask(this.board.id, this.column.id, taskRequest)
      .pipe(
        takeUntil(this.columnNotifier)
      )
      .subscribe((taskResponse: TaskResponse) => {
        this.tasksArray.push(taskResponse)
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
    this.taskService.createTask(this.board.id, this.column.id, taskRequest)
      .pipe(
        takeUntil(this.columnNotifier)
      )
      .subscribe((taskResponse: TaskResponse) => {
        this.tasksArray.find((task: TaskResponse) => {
          if (task.id === deletedTask.id) {
            task.id = taskResponse.id
            task.order = taskResponse.order
            task.boardId = taskResponse.boardId
            task.columnId = taskResponse.columnId
          }
        })
      })
  }

  deleteMovedTask(columnId: string, taskId: string): void {
    this.taskService.deleteTask(this.board.id, columnId, taskId)
      .pipe(
        takeUntil(this.columnNotifier)
      )
      .subscribe()
  }

  dropTask(event: CdkDragDrop<TaskResponse[]>): void {

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

    const movedTask: TaskResponse = event.container.data[event.currentIndex]
    const movedTaskIndex: number = event.currentIndex
    const movedTaskOrder: number = event.container.data[movedTaskIndex].order
    const currentTaskArray: TaskResponse[] = event.container.data
    const previousTaskArray: TaskResponse[] = event.previousContainer.data
    const previousTaskIndex: number = event.previousIndex

    if (event.container.data !== event.previousContainer.data) {
      this.dropTaskBetweenColumns(movedTask, movedTaskIndex, previousTaskIndex, currentTaskArray, previousTaskArray)

    } else {
      this.dropTaskInsideColumn(movedTask, movedTaskIndex, movedTaskOrder)
    }
  }

  dropTaskBetweenColumns(movedTask: TaskResponse, movedTaskIndex: number, previousTaskIndex: number, currentTaskArray: TaskResponse[], previousTaskArray: TaskResponse[]) {
    const changeTaskOrderCurrentColumnArray: TaskResponse[] = []
    const changeTaskOrderPrevColumnArray: TaskResponse[] = []
    movedTask.order = movedTaskIndex + 1

    for (let i = movedTaskIndex + 1; i <= currentTaskArray.length - 1; i++) {
      const taskResponse: TaskResponse = JSON.parse(JSON.stringify(currentTaskArray[i]))
      taskResponse.order += 1
      changeTaskOrderCurrentColumnArray.push(taskResponse)
    }

    for (let i = previousTaskIndex; i <= previousTaskArray.length - 1; i++) {
      const taskResponse: TaskResponse = JSON.parse(JSON.stringify(previousTaskArray[i]))
      taskResponse.order -= 1
      changeTaskOrderPrevColumnArray.push(taskResponse)
    }

    this.addMovedTask(movedTask);
    this.deleteMovedTask(movedTask.columnId, movedTask.id)
    this.changeTasksOrderPreviousColumn(movedTask.columnId, changeTaskOrderPrevColumnArray)
    this.changeTasksOrderCurrentColumn(this.column.id, changeTaskOrderCurrentColumnArray)
  }

  dropTaskInsideColumn(movedTask: TaskResponse, movedTaskIndex: number, movedTaskOrder: number) {
    const requestArray: TaskResponse[] = [];

    if (movedTaskIndex >= movedTaskOrder) {

      for (let i: number = movedTaskOrder - 1; i < movedTaskIndex; i++) {
        const taskResponse: TaskResponse = JSON.parse(JSON.stringify(this.tasksArray[i]))
        taskResponse.order -= 1
        requestArray.push(taskResponse)
      }
    } else {

      for (let i: number = movedTaskOrder - 1; i > movedTaskIndex; i--) {
        const taskResponse: TaskResponse = JSON.parse(JSON.stringify(this.tasksArray[i]))
        taskResponse.order += 1
        requestArray.push(taskResponse)
      }
    }
    movedTask.order = movedTaskIndex + 1;
    requestArray.push(movedTask)
    this.changeTasksOrderCurrentColumn(this.column.id, requestArray)
  }

  changeTasksOrderCurrentColumn(columnId: string, changeOrderArray: TaskResponse[]): void {
    from(changeOrderArray)
      .pipe(
        takeUntil(this.columnNotifier),
        concatMap((response: TaskResponse) => {
          return this.taskService.updateTaskOrder(this.board.id, columnId, response)
        })
      )
      .subscribe((changedTaskResponse: TaskResponse) => {
        this.tasksArray.find((taskResponse: TaskResponse) => {
          if (changedTaskResponse.id === taskResponse.id) {
            taskResponse.order = changedTaskResponse.order
          }
        })
      })
  }

  changeTasksOrderPreviousColumn(columnId: string, changeOrderArray: TaskResponse[]): void {
    from(changeOrderArray)
      .pipe(
        takeUntil(this.columnNotifier),
        concatMap((response: TaskResponse) => {
          return this.taskService.updateTaskOrder(this.board.id, columnId, response)
        })
      )
      .subscribe((changedTaskResponse: TaskResponse) => {
        this.columnsArray.find((columnResponse: ColumnResponse) => {
          if (columnId === columnResponse.id) {
            columnResponse.tasks.find((taskResponse: TaskResponse) => {
              if (changedTaskResponse.id === taskResponse.id) {
                taskResponse.order = changedTaskResponse.order
              }
            })
          }
        })
      })
  }

  changeColumnsOrder(changeOrderArray: ColumnResponse[]): void {
    from(changeOrderArray)
      .pipe(
        takeUntil(this.columnNotifier),
        concatMap((columnResponse: ColumnResponse) => {
          return this.columnService.updateColumnOrder(this.board.id, columnResponse)
        })
      )
      .subscribe((changedColumnResponse: ColumnResponse) => {
        this.columnsArray.find((columnResponse: ColumnResponse) => {
          if (changedColumnResponse.id === columnResponse.id) {
            columnResponse.order = changedColumnResponse.order
          }
        })
      })

  }
}
