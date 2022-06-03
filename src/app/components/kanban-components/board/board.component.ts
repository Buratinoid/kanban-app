import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Subscription, map, switchMap, Subject, takeUntil} from 'rxjs';

import {BoardService} from '../../../services/board.service';
import {ColumnService} from '../../../services/column.service';

import {ColumnAddComponent} from '../../../modals/column-add/column-add.component';

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
    // this.userSubscription = this.userService
    //   .getAllUsers()
    //   .pipe(
    //     takeUntil(this.userNotifier)
    //   )
    //   .subscribe(
    //     (users: UserResponse[]) => {
    //       this.userService.users = users
    //     }
    //   )
  }

  ngOnDestroy(): void {
    this.boardNotifier.next();
    this.boardNotifier.complete();
    this.boardSubscription.unsubscribe();

    this.userNotifier.next();
    this.userNotifier.complete();
    this.userSubscription.unsubscribe();
  }

  getAllColumns(): void {
    this.boardSubscription = this.columnService
      .getAllColumns(this.boardResponse.id)
      .pipe(
        takeUntil(this.boardNotifier)
      )
      .subscribe((columns: ColumnResponse[]) => this.columnResponseArray = columns)
  }

  createColumn(columnRequest: ColumnRequest): void {
    this.boardSubscription = this.columnService
      .createColumn(this.boardResponse.id, columnRequest)
      .pipe(
        takeUntil(this.boardNotifier)
      )
      .subscribe(() => {
        this.getAllColumns()
      })
  }

  newColumnModal(): void {
    const newColumnMatDialogConfig = new MatDialogConfig();

    newColumnMatDialogConfig.disableClose = true;
    newColumnMatDialogConfig.autoFocus = false;

    const newColumnMatDialogRef = this.matDialog.open(ColumnAddComponent, newColumnMatDialogConfig)

    newColumnMatDialogRef.afterClosed().subscribe(
      (columnRequest: ColumnRequest) => {
        if (columnRequest !== undefined) {
          this.createColumn(columnRequest)
        }
      }
    )
  }
}
