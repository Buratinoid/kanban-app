import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, Subscription } from 'rxjs';
import { ColumnService } from '../../services/column.service';
import { Board } from '../../models/board';
import { Column } from '../../models/column';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

  board!: Board;
  columns!: Column[];

  columnSubscription: Subscription = new Subscription;

  constructor(  private route: ActivatedRoute, 
                private columnHttp: ColumnService) { }

  ngOnInit() {
    this.columnSubscription = this.route.params
    .pipe(
      map(params => params['id']),
      switchMap((boardId: string) => this.columnHttp.getAllColumns(boardId))
    )
    .subscribe((columns: Column[]) => this.columns = columns)
  }
  
  ngOnDestroy(): void {
    this.columnSubscription.unsubscribe()
  }
}
