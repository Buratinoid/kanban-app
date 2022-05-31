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
    @Inject(MAT_DIALOG_DATA) data: BoardResponse
  ) {
    this.updateBoardForm = new FormGroup({
      title: new FormControl(data.title, [Validators.required]),
      description: new FormControl(data.description, [Validators.required])
    })
  }

  ngOnInit(): void {
  }

  updateBoard(): void {
    if (this.updateBoardForm.valid) {
      const value: BoardRequest = this.updateBoardForm.value
      const board: BoardRequest = {
        title: value.title,
        description: value.description
      }
      this.updateBoardDialogRef.close(board)
    }
  }

  close(): void {
    this.updateBoardDialogRef.close()
  }
}
