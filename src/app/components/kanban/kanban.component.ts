import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Board } from 'src/app/models/board';
import { BoardModalComponent } from 'src/app/modals/board-modal/board-modal.component';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit, OnDestroy {

  boards!: Board[];

  boardSubscription: Subscription = new Subscription;

  constructor(
              private newBoardDialog: MatDialog,
              private boardHttp: BoardService) { }

  ngOnInit(): void {
    this.boardSubscription = this.boardHttp
    .getAllBoards()
    .subscribe((boards: Board[]) => this.boards = boards)
  }

  ngOnDestroy(): void {
    this.boardSubscription.unsubscribe()
  }

  openNewBoardModal(): void {
    const newBoardDialogConfig = new MatDialogConfig();

    newBoardDialogConfig.disableClose = true;
    newBoardDialogConfig.autoFocus = false;

    newBoardDialogConfig.data = {
    
    }

    this.newBoardDialog.open(BoardModalComponent, newBoardDialogConfig)
  }
}