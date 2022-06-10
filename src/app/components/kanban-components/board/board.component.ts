import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Subscription, map, switchMap, Subject, takeUntil, Observable, from, concatMap} from 'rxjs';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import {UserService} from '../../../services/user.service';
import {BoardService} from '../../../services/board.service';
import {ColumnService} from '../../../services/column.service';

import {ColumnAddComponent} from '../../../modals/column-add/column-add.component';

import {UserResponse} from '../../../models/user-response';
import {ColumnResponse} from '../../../models/column-response';
import {ColumnRequest} from '../../../models/column-request';
import {BoardResponse} from '../../../models/board-response';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

  boardResponse: BoardResponse = new BoardResponse();
  columnResponseArray: ColumnResponse[] = [];

  boardSubscription: Subscription = new Subscription;
  userSubscription: Subscription = new Subscription;

  boardNotifier: Subject<void> = new Subject();
  userNotifier: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private boardService: BoardService,
    private columnService: ColumnService,
    private matDialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.boardSubscription = this.route.params
      .pipe(
        takeUntil(this.boardNotifier),
        map((params: Params) => params["id"]),
        switchMap((id: string) =>
          this.boardService.getBoard(id))
      )
      .subscribe((board: BoardResponse) => {
        this.boardResponse = board;
        this.columnResponseArray = this.boardResponse.columns;
      })
    this.userSubscription = this.userService
      .getAllUsers()
      .pipe(
        takeUntil(this.userNotifier)
      )
      .subscribe(
        (users: UserResponse[]) => {
          this.userService.users = users
        }
      )
  }

  ngOnDestroy(): void {
    this.boardNotifier.next();
    this.boardNotifier.complete();
    this.boardSubscription.unsubscribe();

    this.userNotifier.next();
    this.userNotifier.complete();
    this.userSubscription.unsubscribe();
  }

  addColumn(columnRequest: ColumnRequest): void {
    const increaseColumnOrder: number = 1;
    
    if (this.columnResponseArray.length === 0) {
      columnRequest.order = increaseColumnOrder
    } else {
      const lastColumnIndex = this.columnResponseArray.length - 1
      columnRequest.order = this.columnResponseArray[lastColumnIndex].order + increaseColumnOrder
    }
    this.boardSubscription = this.columnService
      .createColumn(this.boardResponse.id, columnRequest)
      .pipe(
        takeUntil(this.boardNotifier)
      )
      .subscribe((columnResponse: ColumnResponse) => {
        this.columnResponseArray.push(columnResponse)
      })
  }

  addColumnModal(): void {
    const newColumnMatDialogConfig = new MatDialogConfig();

    newColumnMatDialogConfig.disableClose = true;
    newColumnMatDialogConfig.autoFocus = true;

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
    const movedColumn: ColumnResponse = this.columnResponseArray[event.previousIndex]

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

    const tempColumn: ColumnResponse = JSON.parse(JSON.stringify(movedColumn))
    tempColumn.order = 0; //На сервере не может быть колонок с одним 'order' (таски можно)
    const changeColumnOrderArray: ColumnResponse[] = []
    changeColumnOrderArray.push(tempColumn)

    const movedColumnIndex: number = this.columnResponseArray.findIndex((column: ColumnResponse) => column.id === movedColumn.id);
    const movedColumnOrder: number = movedColumn.order;

    if (movedColumnIndex >= movedColumnOrder) {

      for (let i: number = movedColumnOrder - 1; i < movedColumnIndex; i++) {
        const columnResponse: ColumnResponse = JSON.parse(JSON.stringify(this.columnResponseArray[i]))
        columnResponse.order -= 1
        changeColumnOrderArray.push(columnResponse)

      }
    } else {

      for (let i: number = movedColumnOrder - 1; i > movedColumnIndex; i--) {
        const columnResponse: ColumnResponse = JSON.parse(JSON.stringify(this.columnResponseArray[i]))
        columnResponse.order += 1
        changeColumnOrderArray.push(columnResponse)
      }
    }

    movedColumn.order = movedColumnIndex + 1;
    changeColumnOrderArray.push(JSON.parse(JSON.stringify(movedColumn)))

    this.changeColumnsOrder(changeColumnOrderArray)
      .subscribe((changedColumnResponse: ColumnResponse) => {
        this.columnResponseArray.find((columnResponse: ColumnResponse) => {
          if (changedColumnResponse.id === columnResponse.id) {
            columnResponse.order = changedColumnResponse.order
          }
        })
      })
  }

  changeColumnsOrder(changeOrderArray: ColumnResponse[]): Observable<ColumnResponse> {
    return from(changeOrderArray).pipe(
      takeUntil(this.boardNotifier),
      concatMap((columnResponse: ColumnResponse) => this.columnService.updateColumnOrder(this.boardResponse.id, columnResponse))
    )
  }
}
