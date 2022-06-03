import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Subscription, Subject, takeUntil} from 'rxjs';

import { ColumnService } from './../../../services/column.service';
import {TaskService} from '../../../services/task.service';

import { ColumnUpdateComponent } from './../../../modals/column-update/column-update.component';
import {DeleteConfirmComponent} from '../../../modals/delete-confirm/delete-confirm.component';
import {TaskAddComponent} from '../../../modals/task-add/task-add.component';

import {BoardResponse} from '../../../models/board-response';
import {ColumnResponse} from '../../../models/column-response';
import { ColumnRequest } from './../../../models/column-request';
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

    showInput: boolean = false;

    taskResponseArray: TaskResponse[] = [];

    columnSubscription: Subscription = new Subscription;
    columnNotifier: Subject<void> = new Subject();

    constructor(
        private columnService: ColumnService,
        private taskService: TaskService,
        private matDialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.taskResponseArray = this.columnResponse.tasks;
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
            .subscribe((tasks: TaskResponse[]) => this.taskResponseArray = tasks)
    }

    deleteColumn(columnId: string): void {
      this.columnSubscription = this.columnService
        .deleteColumn(this.boardResponse.id, columnId)
        .pipe(
          takeUntil(this.columnNotifier)
        )
        .subscribe(() => {
          console.log(`Column ${columnId} deleted!`)
        //   this.getAllColumns()
        })
    }
  
    updateColumn(columnId: string, columnRequest: ColumnRequest): void {
      this.columnSubscription = this.columnService
        .updateColumn(this.boardResponse.id, columnId, columnRequest)
        .pipe(
          takeUntil(this.columnNotifier)
        )
        .subscribe(() => {
        //   this.getAllColumns()
        })
    }

    updateColumnModal(columnId: string, columnResponse: ColumnResponse): void {
      const updateColumnDialogConfig = new MatDialogConfig();
  
      updateColumnDialogConfig.disableClose = true;
      updateColumnDialogConfig.autoFocus = false;
  
      updateColumnDialogConfig.data = columnResponse
  
      const updateColumnDialogRef = this.matDialog.open(ColumnUpdateComponent, updateColumnDialogConfig)
  
      updateColumnDialogRef.afterClosed().subscribe(
        (columnRequest: ColumnRequest) => {
          if (columnRequest !== undefined) {
            this.updateColumn(columnId, columnRequest)
          }
        }
      )
    }
  
    deleteColumnModal(columnId: string): void {
      const deleteColumnDialogConfig = new MatDialogConfig();
  
      deleteColumnDialogConfig.disableClose = true;
      deleteColumnDialogConfig.autoFocus = false;
  
      const deleteColumnDialogRef = this.matDialog.open(DeleteConfirmComponent, deleteColumnDialogConfig)
  
      deleteColumnDialogRef.afterClosed().subscribe(
        (deleteConfirm: boolean) => {
          if (deleteConfirm) {
            this.deleteColumn(columnId)
          }
        }
      )
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
}
