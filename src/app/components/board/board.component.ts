import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, map, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from './../../services/board.service';
import { Board } from '../../models/board';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

  board!: Board;
  boards!: Board[]

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
    .subscribe((board: Board) => this.board = board)
  }
  
  ngOnDestroy(): void {
    this.boardSubscription.unsubscribe()
  }
}