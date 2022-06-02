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
  task: TaskResponse = new TaskResponse();

  users: UserResponse[] = [];

  user: any; //??? Ошибка с типами из-за .find (говорит про | undefined)
  // user: UserResponse = new UserResponse(); 

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.users = this.userService.users
    this.getUser()
  }

  ngOnDestroy(): void {
  }

  getUser() {
    this.user = this.userService.users.find((user: UserResponse) => user.id === this.task.userId)
  }
}