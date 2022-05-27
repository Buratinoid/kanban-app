import { ColumnResponse } from '../../models/column-response';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, map, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from './../../services/board.service';
import { BoardResponse } from '../../models/board-response';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

  board: BoardResponse = new BoardResponse('','','',[]);
  columns!: ColumnResponse[];
  column!: ColumnResponse;

  boardSubscription: Subscription = new Subscription;

  constructor(
              private route: ActivatedRoute, 
              private boardHttp: BoardService,
              ) { }

  ngOnInit(): void {
    this.boardSubscription = this.route.params
    .pipe(
      map(params => params["id"]),
      switchMap(id => this.boardHttp.getBoard(id))
    )
    .subscribe((board: BoardResponse) => {
      this.board = board;
      this.columns = this.board.columns;
    })
  }
  
  ngOnDestroy(): void {
    this.boardSubscription.unsubscribe()
  }
}