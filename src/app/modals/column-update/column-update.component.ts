import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { Component, OnInit, Inject } from '@angular/core';
import { ColumnService } from 'src/app/services/column.service';
import { ColumnResponse } from 'src/app/models/column-response';
import { ColumnRequest } from 'src/app/models/column-request';

@Component({
  selector: 'app-column-update',
  templateUrl: './column-update.component.html',
  styleUrls: ['./column-update.component.css']
})
export class ColumnUpdateComponent implements OnInit {

  updateColumnForm: FormGroup;

  updateColumnSubscription: Subscription = new Subscription;

  columnUpdateNotifier: Subject<void> = new Subject();
  
  constructor(
    private updateColumnHttp: ColumnService,
    private updateColumnDialogRef: MatDialogRef<ColumnUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) data: ColumnResponse
  ) { 
    this.updateColumnForm = new FormGroup({
      title: new FormControl(data.title, [Validators.required]),
      order: new FormControl(data.order, [Validators.pattern(/[0-9]/)])
    })
  }

  ngOnInit() {
  }

  updateColumn() {
    if(this.updateColumnForm.valid) {
      const value = this.updateColumnForm.value
      const column: ColumnRequest = {
        title: value.title,
        order: Number(value.order)
      }
      this.updateColumnDialogRef.close(column)
    }
  }

  close() {
    this.updateColumnDialogRef.close()
  }
}
