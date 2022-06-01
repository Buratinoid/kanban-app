import { UserResponse } from './../../models/user-response';
import { Subscription, Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {

  users: UserResponse[] = [];

  usersSubscription: Subscription = new Subscription;

  usersNotifier: Subject<void> = new Subject();

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.usersSubscription = this.userService
    .getAllUsers()
    .pipe(
      takeUntil(this.usersNotifier)
    )
    .subscribe((users: UserResponse[]) => {
      this.users = users
    })
  }

  ngOnDestroy(): void {
    this.usersNotifier.next();
    this.usersNotifier.complete();
    this.usersSubscription.unsubscribe();
  }
}
