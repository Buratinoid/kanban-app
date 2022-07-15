import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Subject, takeUntil} from 'rxjs';
import {BoardService} from '../../../services/board.service';

import {HeaderService} from '../../../services/header.service';
import {UserService} from '../../../services/user.service';

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

  kanbanNotifier: Subject<void> = new Subject();

  constructor(
    private matDialog: MatDialog,
    private headerService: HeaderService,
    private userService: UserService,
    private boardService: BoardService
  ) {
  }

  ngOnInit(): void {
    this.getAllBoards()
    this.headerService.isKanbanIn = true;
    this.userService.getAllUsers()
      .pipe(
        takeUntil(this.kanbanNotifier)
      )
      .subscribe()
  }

  ngOnDestroy(): void {
    this.kanbanNotifier.next();
    this.kanbanNotifier.complete();
    this.headerService.isKanbanIn = false;
  }

  getAllBoards(): void {
    this.boardService.getAllBoards()
      .pipe(
        takeUntil(this.kanbanNotifier)
      )
      .subscribe()
  }

  getBoardsArray(): BoardResponse[] {
    return this.boardService.boardsArray
  }

  updateBoardModal(updatedBoardId: string, boardForUpdate: BoardResponse): void {
    const updateBoardDialogConfig = new MatDialogConfig();

    updateBoardDialogConfig.disableClose = true;
    updateBoardDialogConfig.autoFocus = false;

    updateBoardDialogConfig.data = boardForUpdate;

    const updateBoardDialogRef = this.matDialog.open(BoardUpdateComponent, updateBoardDialogConfig)

    updateBoardDialogRef.afterClosed().subscribe(
      (updatedBoard: BoardRequest) => {
        if (updatedBoard !== undefined) {
          this.boardService.updateBoard(updatedBoardId, updatedBoard)
            .pipe(
              takeUntil(this.kanbanNotifier)
            )
            .subscribe()
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
          this.boardService.deleteBoard(deletedBoardId, deletedBoard)
            .pipe(
              takeUntil(this.kanbanNotifier)
            )
            .subscribe()
        }
      }
    )
  }
}
