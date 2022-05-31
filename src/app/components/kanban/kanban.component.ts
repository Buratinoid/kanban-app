import {BoardUpdateComponent} from '../../modals/board-update/board-update.component';
import {BoardRequest} from '../../models/board-request';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Subscription, Subject, takeUntil} from 'rxjs';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {BoardService} from '../../services/board.service';
import {BoardAddComponent} from 'src/app/modals/board-add/board-add.component';
import {BoardResponse} from '../../models/board-response';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit, OnDestroy {

  boards: BoardResponse[] = [];

  boardSubscription: Subscription = new Subscription;

  boardNotifier: Subject<void> = new Subject();


  constructor(
    private newBoardDialog: MatDialog,
    private boardHttp: BoardService) {
  }

  ngOnInit(): void {
    this.getAllBoards()
  }

  ngOnDestroy(): void {
    this.boardNotifier.next();
    this.boardNotifier.complete();
    this.boardSubscription.unsubscribe();
  }

  getAllBoards(): void {
    this.boardSubscription = this.boardHttp
      .getAllBoards()
      .pipe(
        takeUntil(this.boardNotifier)
      )
      .subscribe((boards: BoardResponse[]) => this.boards = boards)
  }

  deleteBoard(boardId: string): void {
    this.boardSubscription = this.boardHttp
      .deleteBoard(boardId)
      .pipe(
        takeUntil(this.boardNotifier)
      )
      .subscribe(() => {
        console.log(`Board ${boardId} deleted!`);
        this.getAllBoards();
      })
  }

  // updateBoard(boardId: string, board: BoardRequest): void {
  //   this.boardSubscription = this.boardHttp
  //     .updateBoard(boardId, board)
  //     .pipe(
  //       takeUntil(this.boardNotifier)
  //     )
  //     .subscribe(() => {
  //       console.log(`Board ${boardId} updated!`);
  //       this.getAllBoards();
  //     })
  // }

  openNewBoardModal(): void {
    const newBoardDialogConfig = new MatDialogConfig();

    newBoardDialogConfig.disableClose = true;
    newBoardDialogConfig.autoFocus = false;

    const newBoardDialogRef = this.newBoardDialog.open(BoardAddComponent, newBoardDialogConfig)

    newBoardDialogRef.afterClosed().subscribe(
      data => {
        if (data !== undefined) {
          this.getAllBoards()
        }
      })
  }

  openUpdateBoardModal(board: BoardResponse) {
    const updateBoardDialogConfig = new MatDialogConfig();

    updateBoardDialogConfig.disableClose = true;
    updateBoardDialogConfig.autoFocus = false;

    updateBoardDialogConfig.data = board;

    const updateBoardDialogRef = this.newBoardDialog.open(BoardUpdateComponent, updateBoardDialogConfig)

    updateBoardDialogRef.afterClosed().subscribe(
      data => {
        if (data !== undefined) {
          this.getAllBoards()
        }
      }
    )
  }
}
