import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

import {ColumnRequest} from '../../models/column-request';

@Component({
  selector: 'app-column-add',
  templateUrl: './column-add.component.html',
  styleUrls: ['./column-add.component.css']
})
export class ColumnAddComponent implements OnInit {

  newColumnForm: FormGroup;

  constructor(
    private newColumnDialogRef: MatDialogRef<ColumnAddComponent>,
  ) {
    this.newColumnForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit(): void {
  }

  newColumn(): void {
    if (this.newColumnForm.valid) {
      const value: ColumnRequest = this.newColumnForm.value
      const columnRequest: ColumnRequest = {
        title: value.title,
        order: 0
      }
      this.newColumnDialogRef.close(columnRequest)
    }
  }

  close(): void {
    this.newColumnDialogRef.close()
  }
}
