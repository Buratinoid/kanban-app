import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Subscription, Subject, takeUntil} from 'rxjs';

import {BoardService} from '../../../services/board.service';

import {BoardAddComponent} from '../../../modals/board-add/board-add.component';
import {BoardUpdateComponent} from '../../../modals/board-update/board-update.component';
import {DeleteConfirmComponent} from '../../../modals/delete-confirm/delete-confirm.component';

import {BoardResponse} from '../../../models/board-response';
import {BoardRequest} from '../../../models/board-request';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit, OnDestroy {

  boardResponseArray: BoardResponse[] = [];

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
      .subscribe((boardResponseArray: BoardResponse[]) => this.boardResponseArray = boardResponseArray)
  }

  createBoard(boardRequest: BoardRequest): void {
    this.kanbanSubscription = this.boardService
      .createBoard(boardRequest)
      .pipe(
        takeUntil(this.kanbanNotifier)
      )
      .subscribe((boardResponse: BoardResponse) => {
        this.boardResponseArray.push(boardResponse)
      })
  }

  deleteBoard(deletedBoardId: string, deletedBoard: BoardResponse): void {
    const deletedBoardIndex = this.boardResponseArray.indexOf(deletedBoard)
    this.kanbanSubscription = this.boardService
      .deleteBoard(deletedBoardId)
      .pipe(
        takeUntil(this.kanbanNotifier)
      )
      .subscribe(() => {
          this.boardResponseArray.splice(deletedBoardIndex, 1)
        }
      )
  }

  updateBoard(updatedBoardId: string, updatedBoardRequest: BoardRequest): void {
    this.kanbanSubscription = this.boardService
      .updateBoard(updatedBoardId, updatedBoardRequest)
      .pipe(
        takeUntil(this.kanbanNotifier)
      )
      .subscribe((updatedBoardResponse: BoardResponse) => {
        this.boardResponseArray.find((boardResponse: BoardResponse) => {
          if (boardResponse.id === updatedBoardId) {
            boardResponse.title = updatedBoardResponse.title
            boardResponse.description = updatedBoardResponse.description
          }
        })
      })
  }

  addBoardModal(): void {
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

  deleteBoardModal(deletedBoardId: string, deletedBoard: BoardResponse): void {
    const deleteColumnDialogConfig = new MatDialogConfig();

    deleteColumnDialogConfig.disableClose = true;
    deleteColumnDialogConfig.autoFocus = false;

    const deleteColumnDialogRef = this.matDialog.open(DeleteConfirmComponent, deleteColumnDialogConfig)

    deleteColumnDialogRef.afterClosed().subscribe(
      (deleteConfirm: boolean) => {
        if (deleteConfirm) {
          this.deleteBoard(deletedBoardId, deletedBoard)
        }
      }
    )
  }
}
