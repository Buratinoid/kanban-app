import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

import {BoardRequest} from '../../models/board-request';

@Component({
  selector: 'app-board-add',
  templateUrl: './board-add.component.html',
  styleUrls: ['./board-add.component.css']
})
export class BoardAddComponent implements OnInit {

  newBoardForm: FormGroup;

  constructor(
    private newBoardDialogRef: MatDialogRef<BoardAddComponent>
  ) {
    this.newBoardForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
  }

  newBoard(): void {
    if (this.newBoardForm.valid) {
      const value: BoardRequest = this.newBoardForm.value;
      const boardRequest: BoardRequest = {
        title: value.title,
        description: value.description
      }
      this.newBoardDialogRef.close(boardRequest)
    }
  }

  close(): void {
    this.newBoardDialogRef.close()
  }
}
