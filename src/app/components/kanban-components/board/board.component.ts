import {UserResponse} from '../../../models/user-response';
import {UserService} from '../../../services/user.service';
import {DeleteConfirmComponent} from '../../../modals/delete-confirm/delete-confirm.component';
import {ColumnRequest} from '../../../models/column-request';
import {ColumnUpdateComponent} from '../../../modals/column-update/column-update.component';
import {ColumnAddComponent} from '../../../modals/column-add/column-add.component';
import {ColumnService} from '../../../services/column.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ColumnResponse} from '../../../models/column-response';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription, map, switchMap, Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Params} from '@angular/router';
import {BoardService} from '../../../services/board.service';
import {BoardResponse} from '../../../models/board-response';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

  boardResponse: BoardResponse = new BoardResponse();
  columnsResponse: ColumnResponse[] = [];
  usersResponse: UserResponse[] = [];

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
        this.columnsResponse = this.boardResponse.columns;
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

  getAllColumns(): void {
    this.boardSubscription = this.columnService
      .getAllColumns(this.boardResponse.id)
      .pipe(
        takeUntil(this.boardNotifier)
      )
      .subscribe((columns: ColumnResponse[]) => this.columnsResponse = columns)
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

  deleteColumn(columnId: string): void {
    this.boardSubscription = this.columnService
      .deleteColumn(this.boardResponse.id, columnId)
      .pipe(
        takeUntil(this.boardNotifier)
      )
      .subscribe(() => {
        console.log(`Column ${columnId} deleted!`)
        this.getAllColumns()
      })
  }

  updateColumn(columnId: string, columnRequest: ColumnRequest): void {
    this.boardSubscription = this.columnService
      .updateColumn(this.boardResponse.id, columnId, columnRequest)
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
}
