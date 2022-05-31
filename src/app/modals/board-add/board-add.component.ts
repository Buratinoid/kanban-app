import {BoardResponse} from '../../models/board-response';
import {Subscription, takeUntil, Subject} from 'rxjs';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {Component, OnInit} from '@angular/core';
import {BoardRequest} from '../../models/board-request';
import {BoardService} from 'src/app/services/board.service';

@Component({
  selector: 'app-board-add',
  templateUrl: './board-add.component.html',
  styleUrls: ['./board-add.component.css']
})
export class BoardAddComponent implements OnInit {

  newBoardForm: FormGroup;

  newBoardSubscription: Subscription = new Subscription;

  boardAddNotifier: Subject<void> = new Subject();

  constructor(
    private newBoardHttp: BoardService,
    private newBoardDialogRef: MatDialogRef<BoardAddComponent>
  ) {
    this.newBoardForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
  }

  newBoard() {
    if (this.newBoardForm.valid) {
      const value = this.newBoardForm.value;
      const board: BoardRequest = {
        title: value.title,
        description: value.description
      }
      this.newBoardSubscription = this.newBoardHttp
        .createBoard(board)
        .pipe(
          takeUntil(this.boardAddNotifier)
        )
        .subscribe((response: BoardResponse) => {
          this.newBoardDialogRef.close(response)
        })
    }
  }

  close(): void {
    this.newBoardDialogRef.close()
  }

  ngOnDestroy(): void {
    this.boardAddNotifier.next();
    this.boardAddNotifier.complete();
    this.newBoardSubscription.unsubscribe();
  }
}
