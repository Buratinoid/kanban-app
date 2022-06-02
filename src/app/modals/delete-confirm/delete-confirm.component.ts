import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.css']
})
export class DeleteConfirmComponent implements OnInit {

  constructor(
    private deleteDialogRef: MatDialogRef<DeleteConfirmComponent>
  ) {
  }

  ngOnInit(): void {
  }

  confirm(): void {
    this.deleteDialogRef.close(true)
  }

  close(): void {
    this.deleteDialogRef.close(false)
  }
}
