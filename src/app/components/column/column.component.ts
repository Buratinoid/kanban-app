import { Subscription } from 'rxjs';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ColumnService } from 'src/app/services/column.service';
import { BoardResponce } from '../../models/board-responce';
import { ColumnResponce } from '../../models/column-responce';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css']
})
export class ColumnComponent implements OnInit, OnDestroy {
  
  @Input()
  board!: BoardResponce;

  columns!: ColumnResponce[];

  columnSubscription: Subscription = new Subscription

  constructor(private columnHttp: ColumnService) { }

  ngOnInit(): void {
    this.columnSubscription = this.columnHttp
    .getAllColumns(this.board.id)
    .subscribe((columns: ColumnResponce[]) => this.columns = columns)
  }

  ngOnDestroy(): void {
    this.columnSubscription.unsubscribe()
  }
}