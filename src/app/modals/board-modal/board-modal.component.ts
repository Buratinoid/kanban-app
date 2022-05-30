import { BoardResponse } from './../../models/board-response';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { BoardRequest } from '../../models/board-request';
import { BoardService } from 'src/app/services/board.service';

@Component({
  selector: 'app-board-modal',
  templateUrl: './board-modal.component.html',
  styleUrls: ['./board-modal.component.css']
})
export class BoardModalComponent implements OnInit {

  newBoardForm: FormGroup;

  newBoardSubscription: Subscription = new Subscription;

  constructor(
              private newBoardHttp: BoardService,
              private newBoardDialogRef: MatDialogRef<BoardModalComponent>,

              @Inject(MAT_DIALOG_DATA) data: BoardRequest
              ) 
              { 
                this.newBoardForm = new FormGroup({
                  title: new FormControl('',[Validators.required]),
                  description: new FormControl('',[Validators.required])
                })
              }

  ngOnInit(): void {
  }

  newBoard() {
    const newBoard: BoardResponse = new BoardResponse();

    if(this.newBoardForm.valid) {
      const value = this.newBoardForm.value;
      const board: BoardRequest = {
        title: value.title,
        description: value.description
      }
      this.newBoardSubscription = this.newBoardHttp
      .createBoard(board)
      .subscribe((response: BoardResponse) => {
          newBoard.id = response.id,
          newBoard.title = response.title,
          newBoard.description = response.description,
          newBoard.columns = [],
          this.newBoardDialogRef.close(newBoard)
      })
    }
  }

  close(): void {
    this.newBoardDialogRef.close()
  }

  ngOnDestroy(): void {
    this.newBoardSubscription.unsubscribe()  //Почему если включить, то запрос в консоли не отражает время отклика?  
  }
}
