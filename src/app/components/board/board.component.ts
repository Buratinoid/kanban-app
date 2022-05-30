import { ColumnResponse } from '../../models/column-response';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, map, switchMap, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { BoardService } from './../../services/board.service';
import { BoardResponse } from '../../models/board-response';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

  board: BoardResponse = new BoardResponse('','','',[]);
  columns: ColumnResponse[] = [];

  boardSubscription: Subscription = new Subscription;

  notifier: Subject<void> = new Subject();

  constructor(
              private route: ActivatedRoute, 
              private boardHttp: BoardService,
              ) { }

  ngOnInit(): void {
    this.boardSubscription = this.route.params
    .pipe(
      takeUntil(this.notifier),
      map((params: Params) => params["id"]),
      switchMap(id => this.boardHttp.getBoard(id))
    )
    .subscribe((board: BoardResponse) => {
      this.board = board;
      this.columns = this.board.columns;
    })
  }
  
  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
    this.boardSubscription.unsubscribe();
  }

  deleteBoard(): void {
    this.boardHttp.deleteBoard(this.board.id)
    .subscribe(() => console.log(`Board ${this.board.id} deleted!`))
  }
}