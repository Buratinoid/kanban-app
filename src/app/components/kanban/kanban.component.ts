import {DeleteConfirmComponent} from '../../modals/delete-confirm/delete-confirm.component';
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

  boardsResponse: BoardResponse[] = [];

  kanbanSubscription: Subscription = new Subscription;

  kanbanNotifier: Subject<void> = new Subject();


  constructor(
    private matDialog: MatDialog,
    private boardService: BoardService) {
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
    this.kanbanSubscription = this.boardService
      .getAllBoards()
      .pipe(
        takeUntil(this.kanbanNotifier)
      )
      .subscribe((boardsResponse: BoardResponse[]) => this.boardsResponse = boardsResponse)
  }

  createBoard(boardRequest: BoardRequest): void {
    this.kanbanSubscription = this.boardService
      .createBoard(boardRequest)
      .pipe(
        takeUntil(this.kanbanNotifier)
      )
      .subscribe(() => {
        this.getAllBoards();
      })
  }

  deleteBoard(boardId: string): void {
    this.kanbanSubscription = this.boardService
      .deleteBoard(boardId)
      .pipe(
        takeUntil(this.kanbanNotifier)
      )
      .subscribe(() => {
        console.log(`Board ${boardId} deleted!`);
        this.getAllBoards();
      })
  }

  updateBoard(boardId: string, boardRequest: BoardRequest): void {
    this.kanbanSubscription = this.boardService
      .updateBoard(boardId, boardRequest)
      .pipe(
        takeUntil(this.kanbanNotifier)
      )
      .subscribe(() => {
        this.getAllBoards();
      })
  }

  newBoardModal(): void {
    const newBoardMatDialogConfig = new MatDialogConfig();

    newBoardMatDialogConfig.disableClose = true;
    newBoardMatDialogConfig.autoFocus = false;

    const newBoardMatDialogRef = this.matDialog.open(BoardAddComponent, newBoardMatDialogConfig)

    newBoardMatDialogRef.afterClosed().subscribe(
      (boardRequest: BoardRequest) => {
        if (boardRequest !== undefined) {
          this.createBoard(boardRequest)
        }
      }
    )
  }

  updateBoardModal(boardId: string, boardResponse: BoardResponse): void {
    const updateBoardDialogConfig = new MatDialogConfig();

    updateBoardDialogConfig.disableClose = true;
    updateBoardDialogConfig.autoFocus = false;

    updateBoardDialogConfig.data = boardResponse;

    const updateBoardDialogRef = this.matDialog.open(BoardUpdateComponent, updateBoardDialogConfig)

    updateBoardDialogRef.afterClosed().subscribe(
      (boardRequest: BoardRequest) => {
        if (boardRequest !== undefined) {
          this.updateBoard(boardId, boardRequest)
        }
      }
    )
  }

  deleteBoardModal(boardId: string): void {
    const deleteColumnDialogConfig = new MatDialogConfig();

    deleteColumnDialogConfig.disableClose = true;
    deleteColumnDialogConfig.autoFocus = false;

    const deleteColumnDialogRef = this.matDialog.open(DeleteConfirmComponent, deleteColumnDialogConfig)

    deleteColumnDialogRef.afterClosed().subscribe(
      (deleteConfirm: boolean) => {
        if (deleteConfirm) {
          this.deleteBoard(boardId)
        }
      }
    )
  }
}
