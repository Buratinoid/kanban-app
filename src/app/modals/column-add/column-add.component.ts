import {ColumnRequest} from '../../models/column-request';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {Component, OnInit} from '@angular/core';

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
      order: new FormControl('', [Validators.pattern(/[0-9]/)])
    })
  }

  ngOnInit(): void {
  }

  newColumn(): void {
    if (this.newColumnForm.valid) {
      const value: ColumnRequest = this.newColumnForm.value
      const column: ColumnRequest = {
        title: value.title,
        order: Number(value.order)
      }
      this.newColumnDialogRef.close(column)
    }
  }

  close(): void {
    this.newColumnDialogRef.close()
  }
}
