import { BoardRequest } from './../../models/board-request';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardService } from './../../services/board.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-board-update',
  templateUrl: './board-update.component.html',
  styleUrls: ['./board-update.component.css']
})
export class BoardUpdateComponent implements OnInit {

  updateBoardForm: FormGroup;

  updateBoardSubscription: Subscription = new Subscription;

  constructor(
              private updateBoardHttp: BoardService,
              private updateBoardDialogRef: MatDialogRef<BoardUpdateComponent>,
              @Inject(MAT_DIALOG_DATA) data: BoardRequest
              ) 
              { 
                this.updateBoardForm = new FormGroup({
                  title: new FormControl('', [Validators.required]),
                  description: new FormControl('', [Validators.required])
                })
              }

  ngOnInit(): void {
  }

  updateBoard() {
    
  }
}
