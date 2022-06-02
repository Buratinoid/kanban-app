import {UserService} from 'src/app/services/user.service';
import {UserResponse} from '../../models/user-response';
import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {TaskResponse} from '../../models/task-response';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, OnDestroy {

  @Input()
  taskResponse: TaskResponse = new TaskResponse();

  usersResponse: UserResponse[] = [];

  userResponse: UserResponse = new UserResponse();

  constructor(
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.usersResponse = this.userService.users;
    this.getUserbyId();
  }

  ngOnDestroy(): void {
  }

  getUserbyId(): void {
    this.userService.users
    .find((userResponse: UserResponse) => {
      if(userResponse.id === this.taskResponse.userId) {
        this.userResponse = userResponse
      } // добавить else!!!
    });
  }
}
