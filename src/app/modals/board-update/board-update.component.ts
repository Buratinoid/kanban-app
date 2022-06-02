import {BoardRequest} from '../../models/board-request';
import {BoardResponse} from '../../models/board-response';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Component, Inject, OnInit} from '@angular/core';

@Component({
  selector: 'app-board-update',
  templateUrl: './board-update.component.html',
  styleUrls: ['./board-update.component.css']
})
export class BoardUpdateComponent implements OnInit {

  updateBoardForm: FormGroup;

  constructor(
    private updateBoardDialogRef: MatDialogRef<BoardUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) boardResponse: BoardResponse
  ) {
    this.updateBoardForm = new FormGroup({
      title: new FormControl(boardResponse.title, [Validators.required]),
      description: new FormControl(boardResponse.description, [Validators.required])
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
