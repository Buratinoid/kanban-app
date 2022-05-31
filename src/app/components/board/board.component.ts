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
    private boardHttp: BoardService,
    private newColumnDialog: MatDialog,
    private columnHttp: ColumnService
  ) {
  }

  ngOnInit(): void {
    this.boardSubscription = this.route.params
      .pipe(
        takeUntil(this.boardNotifier),
        map((params: Params) => params["id"]),
        switchMap(id => this.boardHttp.getBoard(id))
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

  getAllColumns(boardId: string): void {
    this.boardSubscription = this.columnHttp
      .getAllColumns(boardId)
      .pipe(
        takeUntil(this.boardNotifier)
      )
      .subscribe((columns: ColumnResponse[]) => this.columns = columns)
  }

  newColumnModal(boardId: string): void {
    const newColumnDialogConfig = new MatDialogConfig();

    newColumnDialogConfig.disableClose = true;
    newColumnDialogConfig.autoFocus = false;

    newColumnDialogConfig.data = boardId;

    const newColumnDialogRef = this.newColumnDialog.open(ColumnAddComponent)

    newColumnDialogRef.afterClosed().subscribe(
      data => {
        if (data !== undefined) {
          this.getAllColumns(this.board.id)
        }
      }
    )
  }
}
