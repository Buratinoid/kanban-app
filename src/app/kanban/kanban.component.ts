import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoardService } from '../services/board.service';
import { Board } from '../models/board';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit, OnDestroy {

  boards!: Board[];
  
  subscription: Subscription = new Subscription;

  constructor(private http: BoardService) { }

  ngOnInit() {
    this.subscription = this.http
    .getAllBoards()
    .subscribe((boards: Board[]) => this.boards = boards)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
