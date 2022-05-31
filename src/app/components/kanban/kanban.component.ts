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

  kanbanSubscription: Subscription = new Subscription;

  kanbanNotifier: Subject<void> = new Subject();


  constructor(
    private newBoardDialog: MatDialog,
    private boardHttp: BoardService) {
  }

  ngOnInit(): void {
    this.getAllBoards()
  }

  ngOnDestroy(): void {
    this.kanbanNotifier.next();
    this.kanbanNotifier.complete();
    this.kanbanSubscription.unsubscribe();
  }

  getAllBoards(): void {
    this.kanbanSubscription = this.boardHttp
      .getAllBoards()
      .pipe(
        takeUntil(this.kanbanNotifier)
      )
      .subscribe((boards: BoardResponse[]) => this.boards = boards)
  }

  createBoard(board: BoardRequest): void {
    this.kanbanSubscription = this.boardHttp
    .createBoard(board)
    .pipe(
      takeUntil(this.kanbanNotifier)
    )
    .subscribe(() => {
      this.getAllBoards();
    })
  }

  deleteBoard(boardId: string): void {
    this.kanbanSubscription = this.boardHttp
      .deleteBoard(boardId)
      .pipe(
        takeUntil(this.kanbanNotifier)
      )
      .subscribe(() => {
        console.log(`Board ${boardId} deleted!`);
        this.getAllBoards();
      })
  }

  updateBoard(boardId: string, board: BoardRequest): void {
    this.kanbanSubscription = this.boardHttp
      .updateBoard(boardId, board)
      .pipe(
        takeUntil(this.kanbanNotifier)
      )
      .subscribe(() => {
        this.getAllBoards();
      })
  }

  newBoardModal(): void {
    const newBoardDialogConfig = new MatDialogConfig();

    newBoardDialogConfig.disableClose = true;
    newBoardDialogConfig.autoFocus = false;

    const newBoardDialogRef = this.newBoardDialog.open(BoardAddComponent, newBoardDialogConfig)

    newBoardDialogRef.afterClosed().subscribe(
      (board: BoardRequest) => {
        if (board !== undefined) {
          this.createBoard(board)
        }
      }
    )
  }

  updateBoardModal(boardId: string, board: BoardResponse): void {
    const updateBoardDialogConfig = new MatDialogConfig();

    updateBoardDialogConfig.disableClose = true;
    updateBoardDialogConfig.autoFocus = false;

    updateBoardDialogConfig.data = board;

    const updateBoardDialogRef = this.newBoardDialog.open(BoardUpdateComponent, updateBoardDialogConfig)

    updateBoardDialogRef.afterClosed().subscribe(
      (board: BoardRequest) => {
        if (board !== undefined) {
          this.updateBoard(boardId, board)
        }
      }
    )
  }
}
