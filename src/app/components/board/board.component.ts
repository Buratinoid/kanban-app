import { DeleteConfirmComponent } from './../../modals/delete-confirm/delete-confirm.component';
import { ColumnRequest } from 'src/app/models/column-request';
import { ColumnUpdateComponent } from './../../modals/column-update/column-update.component';
import {ColumnAddComponent} from '../../modals/column-add/column-add.component';
import {ColumnService} from '../../services/column.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ColumnResponse} from '../../models/column-response';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription, map, switchMap, Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Params} from '@angular/router';
import {BoardService} from '../../services/board.service';
import {BoardResponse} from '../../models/board-response';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

  board: BoardResponse = new BoardResponse();
  columns: ColumnResponse[] = [];

  boardSubscription: Subscription = new Subscription;

  boardNotifier: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private matDialog: MatDialog,
    private columnService: ColumnService
  ) {
  }

  ngOnInit(): void {
    this.boardSubscription = this.route.params
      .pipe(
        takeUntil(this.boardNotifier),
        map((params: Params) => params["id"]),
        switchMap(id => this.boardService.getBoard(id))
      )
      .subscribe((board: BoardResponse) => {
        this.board = board;
        this.columns = this.board.columns;
      })
  }

  ngOnDestroy(): void {
    this.boardNotifier.next();
    this.boardNotifier.complete();
    this.boardSubscription.unsubscribe();
  }

  getAllColumns(): void {
    this.boardSubscription = this.columnService
      .getAllColumns(this.board.id)
      .pipe(
        takeUntil(this.boardNotifier)
      )
      .subscribe((columns: ColumnResponse[]) => this.columns = columns)
  }

  createColumn(column: ColumnRequest): void {
    this.boardSubscription = this.columnService
    .createColumn(this.board.id, column)
    .pipe(
      takeUntil(this.boardNotifier)
    )
    .subscribe(() => {
      this.getAllColumns()
    })
  }

  deleteColumn(columnId: string): void {
    this.boardSubscription = this.columnService
    .deleteColumn(this.board.id, columnId)
    .pipe(
      takeUntil(this.boardNotifier)
    )
    .subscribe(() => {
      console.log(`Column ${columnId} deleted!`)
      this.getAllColumns()
    })
  }

  updateColumn(columnId: string, column: ColumnRequest): void {
    this.boardSubscription = this.columnService
    .updateColumn(this.board.id, columnId, column)
    .pipe(
      takeUntil(this.boardNotifier)
    )
    .subscribe(() => {
      this.getAllColumns()
    })
  }

  newColumnModal(): void {
    const matDialogConfig = new MatDialogConfig();

    matDialogConfig.disableClose = true;
    matDialogConfig.autoFocus = false;

    const matDialogRef = this.matDialog.open(ColumnAddComponent, matDialogConfig)

    matDialogRef.afterClosed().subscribe(
      (column: ColumnRequest) => {
        if (column !== undefined) {
          this.createColumn(column)
        }
      }
    )
  }

  updateColumnModal(columnId: string, column: ColumnResponse): void {
    const updateColumnDialogConfig = new MatDialogConfig();

    updateColumnDialogConfig.disableClose = true;
    updateColumnDialogConfig.autoFocus = false;

    updateColumnDialogConfig.data = column

    const updateColumnDialogRef = this.matDialog.open(ColumnUpdateComponent, updateColumnDialogConfig)
  
    updateColumnDialogRef.afterClosed().subscribe(
      (column: ColumnRequest) => {
        if(column !== undefined) {
          this.updateColumn(columnId, column)
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
      (confirm: boolean) => {
        if (confirm === true) {
          this.deleteColumn(columnId)
        }
      }
    )
  }
}
