import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {map, switchMap, Subject, takeUntil, from, concatMap} from 'rxjs';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import {HeaderService} from '../../../services/header.service';
import {BoardService} from '../../../services/board.service';
import {ColumnService} from '../../../services/column.service';

import {ColumnAddComponent} from '../../../modals/column-add/column-add.component';

import {BoardResponse} from '../../../models/board-response';
import {ColumnResponse} from '../../../models/column-response';
import {ColumnRequest} from '../../../models/column-request';
import {TaskResponse} from '../../../models/task-response';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

  board: BoardResponse = new BoardResponse();
  columnsArray: ColumnResponse[] = [];

  boardNotifier: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private headerService: HeaderService,
    private boardService: BoardService,
    private columnService: ColumnService
  ) {
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        takeUntil(this.boardNotifier),
        map((params: Params) => params["id"]),
        switchMap((id: string) =>
          this.boardService.getBoard(id))
      )
      .subscribe((boardResponse: BoardResponse) => {
        this.headerService.boardName = boardResponse.title
        this.headerService.isBoardIn = true;
        this.board = boardResponse;
        this.board.columns.forEach((column: ColumnResponse) => {
          column.tasks.forEach((task: TaskResponse) => {
            task.boardId = this.board.id
            task.columnId = column.id
          })
        })
        this.columnsArray = this.board.columns;
      })
  }

  ngOnDestroy(): void {
    this.boardNotifier.next();
    this.boardNotifier.complete();

    this.headerService.boardName = '';
    this.headerService.isBoardIn = false;
  }

  addColumn(columnRequest: ColumnRequest): void {
    const increaseColumnOrder: number = 1;
    const lastColumnIndex = this.columnsArray.length - 1

    if (this.columnsArray.length === 0) {
      columnRequest.order = increaseColumnOrder
    } else {
      columnRequest.order = this.columnsArray[lastColumnIndex].order + increaseColumnOrder
    }
    this.columnService.createColumn(this.board.id, columnRequest)
      .pipe(
        takeUntil(this.boardNotifier)
      )
      .subscribe((columnResponse: ColumnResponse) => {
        columnResponse.tasks = []  //ColumnResponse от сервера не содержит tasks
        this.columnsArray.push(columnResponse)
      })
  }

  addColumnModal(): void {
    const newColumnMatDialogConfig = new MatDialogConfig();

    newColumnMatDialogConfig.disableClose = true;
    newColumnMatDialogConfig.autoFocus = false;

    const newColumnMatDialogRef = this.matDialog.open(ColumnAddComponent, newColumnMatDialogConfig)

    newColumnMatDialogRef.afterClosed().subscribe(
      (columnRequest: ColumnRequest) => {
        if (columnRequest !== undefined) {
          this.addColumn(columnRequest)
        }
      }
    )
  }

  dropColumn(event: CdkDragDrop<ColumnResponse[]>): void {

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

    const movedColumn: ColumnResponse = event.container.data[event.currentIndex]
    const movedColumnIndex: number = event.currentIndex
    const movedColumnOrder: number = event.container.data[movedColumnIndex].order
    const changeColumnOrderArray: ColumnResponse[] = []

    //На сервере не может быть колонок с одним 'order' (таски можно)
    const tempColumn: ColumnResponse = JSON.parse(JSON.stringify(movedColumn))
    tempColumn.order = 0;

    changeColumnOrderArray.push(tempColumn)

    if (movedColumnIndex >= movedColumnOrder) {

      for (let i: number = movedColumnOrder - 1; i < movedColumnIndex; i++) {
        const columnResponse: ColumnResponse = JSON.parse(JSON.stringify(this.columnsArray[i]))
        columnResponse.order -= 1
        changeColumnOrderArray.push(columnResponse)
      }
    } else {

      for (let i: number = movedColumnOrder - 1; i > movedColumnIndex; i--) {
        const columnResponse: ColumnResponse = JSON.parse(JSON.stringify(this.columnsArray[i]))
        columnResponse.order += 1
        changeColumnOrderArray.push(columnResponse)
      }
    }

    movedColumn.order = movedColumnIndex + 1;
    changeColumnOrderArray.push(JSON.parse(JSON.stringify(movedColumn)))
    this.changeColumnsOrder(changeColumnOrderArray)
  }

  changeColumnsOrder(changeOrderArray: ColumnResponse[]): void {
    from(changeOrderArray)
      .pipe(
        takeUntil(this.boardNotifier),
        concatMap((columnResponse: ColumnResponse) => this.columnService.updateColumnOrder(this.board.id, columnResponse))
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
