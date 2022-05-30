import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { BoardModalComponent } from 'src/app/modals/board-modal/board-modal.component';
import { BoardResponse } from '../../models/board-response';
import { BoardRequest } from './../../models/board-request';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit, OnDestroy {

  boards: BoardResponse[] = [];

  boardSubscription: Subscription = new Subscription;

  constructor(
              private newBoardDialog: MatDialog,
              private boardHttp: BoardService) { }

  ngOnInit(): void {
    this.boardSubscription = this.boardHttp
    .getAllBoards()
    .subscribe((boards: BoardResponse[]) => this.boards = boards)
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
    const dialogRef = this.newBoardDialog.open(BoardModalComponent, newBoardDialogConfig)
  
    dialogRef.afterClosed().subscribe(
      data => this.boards.push(data)     
    )
  }
}