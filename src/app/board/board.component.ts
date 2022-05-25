import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from './../services/board.service';
import { map, switchMap, Subscription } from 'rxjs';
import { Board } from '../models/board';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

  board!: Board;

  subscribtion!: Subscription;

  constructor(private route: ActivatedRoute, private http: BoardService) { }

  ngOnInit() {
    this.subscribtion = this.route.params
    .pipe(
      map(params => params['id']),
      switchMap(boardId => this.http.getBoard(boardId))
    )
    .subscribe((board: Board) => this.board = board)
  }
  
  ngOnDestroy(): void {
    this.subscribtion.unsubscribe()
  }
}
