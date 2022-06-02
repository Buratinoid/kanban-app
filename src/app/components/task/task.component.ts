import { UserService } from 'src/app/services/user.service';
import { UserResponse } from './../../models/user-response';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { TaskResponse } from '../../models/task-response';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, OnDestroy {

  @Input()
  taskResponse: TaskResponse = new TaskResponse();

  usersResponse: UserResponse[] = [];

  userResponse: any; //??? Ошибка с типами из-за .find (говорит про | undefined)
  // userResponse: UserResponse = new UserResponse(); 

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.usersResponse = this.userService.users
    this.getUser()
  }

  ngOnDestroy(): void {
  }

  getUser() {
    this.userResponse = this.userService.users.find((userResponse: UserResponse) => userResponse.id === this.taskResponse.userId)
  }
}