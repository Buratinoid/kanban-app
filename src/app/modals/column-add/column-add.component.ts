import {ColumnResponse} from '../../models/column-response';
import {ColumnRequest} from '../../models/column-request';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ColumnService} from '../../services/column.service';
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription, Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-column-add',
  templateUrl: './column-add.component.html',
  styleUrls: ['./column-add.component.css']
})
export class ColumnAddComponent implements OnInit, OnDestroy {

  boardId!: string;

  newColumnForm: FormGroup;

  newColumnSubscription: Subscription = new Subscription;

  columnAddNotifier: Subject<void> = new Subject();

  constructor(
    private newColumnHttp: ColumnService,
    private newColumnDialogRef: MatDialogRef<ColumnAddComponent>,
    @Inject(MAT_DIALOG_DATA) data: string
  ) {
    this.boardId = data
    this.newColumnForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      order: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
  }

  newColumn() {
    if (this.newColumnForm.valid) {
      const value = this.newColumnForm.value
      const column: ColumnRequest = {
        title: value.title,
        order: value.order
      }
      this.newColumnSubscription = this.newColumnHttp
        .createColumn(this.boardId, column)
        .pipe(
          takeUntil(this.columnAddNotifier)
        )
        .subscribe((response: ColumnResponse) => {
          this.newColumnDialogRef.close(response)
        })
    }
  }

  close(): void {
    this.newColumnDialogRef.close()
  }

  ngOnDestroy(): void {
    this.columnAddNotifier.next();
    this.columnAddNotifier.complete();
    this.newColumnSubscription.unsubscribe();
  }

}
