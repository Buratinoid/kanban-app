import { TaskCondition } from './../../models/task-condition';
import { UserService } from './../../services/user.service';
import { UserResponse } from './../../models/user-response';
import { Subscription, Subject, takeUntil } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TaskRequest } from 'src/app/models/task-request';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.css']
})
export class TaskAddComponent implements OnInit {

  taskCondition = new TaskCondition();

  users: UserResponse[] = [];

  newTaskForm: FormGroup;

  newTaskSubscription: Subscription = new Subscription;

  newTaskNotifier: Subject<void> = new Subject();

  constructor(
    private newTaskDialogRef: MatDialogRef<TaskAddComponent>,
    private userService: UserService
  ) { 
    this.newTaskForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      done: new FormControl('', [Validators.pattern(/[0-1]/)]),
      order: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      userId: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    this.newTaskSubscription = this.userService
    .getAllUsers()
    .pipe(
      takeUntil(this.newTaskNotifier)
    )
    .subscribe(
      (users: UserResponse[]) => this.users = users
    )
  }

  newTask(): void {
    if(this.newTaskForm.valid) {
      const value: TaskRequest = this.newTaskForm.value
      const task: TaskRequest = {
        title: value.title,
        done: Boolean(Number(value.done)),
        order: Number(value.order),
        description: value.description,
        userId: value.userId
      }
      this.newTaskDialogRef.close(task)
    }
  }

  close(): void {
    this.newTaskDialogRef.close()
  }
}
