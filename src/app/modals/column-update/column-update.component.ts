import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { ColumnResponse } from 'src/app/models/column-response';
import { ColumnRequest } from 'src/app/models/column-request';

@Component({
  selector: 'app-column-update',
  templateUrl: './column-update.component.html',
  styleUrls: ['./column-update.component.css']
})
export class ColumnUpdateComponent implements OnInit {

  updateColumnForm: FormGroup;

  constructor(
    private updateColumnDialogRef: MatDialogRef<ColumnUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) columnResponse: ColumnResponse
  ) { 
    this.updateColumnForm = new FormGroup({
      title: new FormControl(columnResponse.title, [Validators.required]),
      order: new FormControl(columnResponse.order, [Validators.pattern(/[0-9]/)])
    })
  }

  ngOnInit(): void {
  }

  updateColumn(): void {
    if(this.updateColumnForm.valid) {
      const value: ColumnRequest = this.updateColumnForm.value
      const columnRequest: ColumnRequest = {
        title: value.title,
        order: Number(value.order)
      }
      this.updateColumnDialogRef.close(columnRequest)
    }
  }

  close(): void {
    this.updateColumnDialogRef.close()
  }
}
