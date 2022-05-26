import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Board } from 'src/app/models/board';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit, OnDestroy {

  boards!: Board[];

  boardSubscription: Subscription = new Subscription;

  constructor(private boardHttp: BoardService) { }

  ngOnInit(): void {
    this.boardSubscription = this.boardHttp
    .getAllBoards()
    .subscribe((boards: Board[]) => this.boards = boards)
  }

  ngOnDestroy(): void {
    this.boardSubscription.unsubscribe()
  }
}