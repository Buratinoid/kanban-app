import {Component, OnInit} from '@angular/core';
import {takeUntil, Subject} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Router} from '@angular/router';

import {BoardAddComponent} from '../../modals/board-add/board-add.component';

import {AuthService} from '../../services/auth.service';
import {BoardService} from '../../services/board.service';

import {HeaderService} from '../../services/header.service';
import {BoardRequest} from '../../models/board-request';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private _isLoggedIn = false;

  private headerNotifier: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private matDialog: MatDialog,
    private authService: AuthService,
    private headerService: HeaderService,
    private boardService: BoardService
  ) {
  }

  ngOnInit(): void {
    this.authService.getIsLoggedIn()
      .subscribe((state: boolean) => this._isLoggedIn = state);
  }

  logOut(): void {
    this.authService.logOut()
    this.router.navigate(['signin'])
  }

  addBoardModal(): void {
    const newBoardMatDialogConfig = new MatDialogConfig();

    newBoardMatDialogConfig.disableClose = true;
    newBoardMatDialogConfig.autoFocus = false;

    const newBoardMatDialogRef = this.matDialog.open(BoardAddComponent, newBoardMatDialogConfig)

    newBoardMatDialogRef.afterClosed().subscribe(
      (boardRequest: BoardRequest) => {
        if (boardRequest !== undefined) {
          this.boardService.createBoard(boardRequest)
            .pipe(
              takeUntil(this.headerNotifier)
            )
            .subscribe()
        }
      }
    )
  }

  public get isLoggedIn(): boolean {
    return this._isLoggedIn
  }

  getBoardName(): string {
    return this.headerService.boardName
  }

  isKanbanIn(): boolean {
    return this.headerService.isKanbanIn
  }

  isBoardIn(): boolean {
    return this.headerService.isBoardIn
  }
}
