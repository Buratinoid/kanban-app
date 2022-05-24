import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RequestService } from '../services/request.service';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit, OnDestroy {

  subscription: Subscription = new Subscription;

  constructor(private http: RequestService) { }

  ngOnInit() {
    this.subscription = this.http
    .getAllBoards()
    .subscribe()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
