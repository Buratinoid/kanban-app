import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { BoardAPI } from '../../APImodels/boardAPI';
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
              @Inject(MAT_DIALOG_DATA) data: BoardAPI 
              ) 
              { 
                this.newBoardForm = new FormGroup({
                  title: new FormControl('',[Validators.required]),
                  description: new FormControl('',[Validators.required])
                })
              }

  ngOnInit(): void {
  }

  createBoard(): void {
    if(this.newBoardForm.valid) {
      const value = this.newBoardForm.value;
      const board: BoardAPI = {
        title: value.title,
        description: value.description
      }
      this.newBoardSubscription = this.newBoardHttp
      .createBoard(board)
      .subscribe()
      this.newBoardForm.reset()
    }
  }

  ngOnDestroy(): void {
    this.newBoardSubscription.unsubscribe()  //Почему если включить, то запрос в консоли не отражает время отклика?  
  }
}
