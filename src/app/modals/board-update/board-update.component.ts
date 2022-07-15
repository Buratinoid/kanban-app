import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {BoardRequest} from '../../models/board-request';
import {BoardResponse} from '../../models/board-response';

@Component({
  selector: 'app-board-update',
  templateUrl: './board-update.component.html',
  styleUrls: ['./board-update.component.css']
})
export class BoardUpdateComponent implements OnInit {

  updateBoardForm: FormGroup;

  constructor(
    private updateBoardDialogRef: MatDialogRef<BoardUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) board: BoardResponse
  ) {
    this.updateBoardForm = new FormGroup({
      title: new FormControl(board.title, [Validators.required]),
      description: new FormControl(board.description, [Validators.required])
    })
  }

  ngOnInit(): void {
  }

  updateBoard(): void {
    if (this.updateBoardForm.valid) {
      const value: BoardRequest = this.updateBoardForm.value
      const boardRequest: BoardRequest = {
        title: value.title,
        description: value.description
      }
      this.updateBoardDialogRef.close(boardRequest)
    }
  }

  close(): void {
    this.updateBoardDialogRef.close()
  }
}
