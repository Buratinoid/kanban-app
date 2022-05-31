import {BoardRequest} from '../../models/board-request';
import {BoardResponse} from '../../models/board-response';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {BoardService} from '../../services/board.service';
import {Subscription, takeUntil, Subject} from 'rxjs';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-board-update',
  templateUrl: './board-update.component.html',
  styleUrls: ['./board-update.component.css']
})
export class BoardUpdateComponent implements OnInit, OnDestroy {

  boardId: string;

  updateBoardForm: FormGroup;

  updateBoardSubscription: Subscription = new Subscription;

  boardUpdateNotifier: Subject<void> = new Subject();

  constructor(
    private updateBoardHttp: BoardService,
    private updateBoardDialogRef: MatDialogRef<BoardUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) data: BoardResponse
  ) {
    this.boardId = data.id
    this.updateBoardForm = new FormGroup({
      title: new FormControl(data.title, [Validators.required]),
      description: new FormControl(data.description, [Validators.required])
    })
  }

  ngOnInit(): void {
  }

  updateBoard() {
    if (this.updateBoardForm.valid) {
      const value = this.updateBoardForm.value
      const board: BoardRequest = {
        title: value.title,
        description: value.description
      }
      this.updateBoardSubscription = this.updateBoardHttp
        .updateBoard(this.boardId, board)
        .pipe(
          takeUntil(this.boardUpdateNotifier)
        )
        .subscribe((response: BoardResponse) => {
          this.updateBoardDialogRef.close(response)
        })
    }
  }

  close(): void {
    this.updateBoardDialogRef.close()
  }

  ngOnDestroy(): void {
    this.boardUpdateNotifier.next();
    this.boardUpdateNotifier.complete();
    this.updateBoardSubscription.unsubscribe();
  }
}
