import { TaskCondition } from './../../models/task-condition';
import { UserResponse } from './../../models/user-response';
import { UserService } from 'src/app/services/user.service';
import { Subscription, Subject, takeUntil } from 'rxjs';
import { TaskRequest } from './../../models/task-request';
import { TaskResponse } from './../../models/task-response';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-task-update',
  templateUrl: './task-update.component.html',
  styleUrls: ['./task-update.component.css']
})
export class TaskUpdateComponent implements OnInit {

  taskCondition = new TaskCondition();
  
  users: UserResponse[] = [];

  updateTaskForm: FormGroup;

  updateTaskSubscription: Subscription = new Subscription;

  updateTaskNotifier: Subject<void> = new Subject();

  constructor(
    private userService: UserService,
    private updateColumnDialogRef: MatDialogRef<TaskUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) data: TaskResponse
  ) { 
    this.updateTaskForm = new FormGroup({
      title: new FormControl(data.title, [Validators.required]),
      done: new FormControl(data.done, [Validators.pattern(/[0-1]/)]),
      order: new FormControl(data.order, [Validators.required]),
      description: new FormControl(data.description, [Validators.required]),
      userId: new FormControl(data.userId, [Validators.required])
    })
  }

  ngOnInit(): void {
    this.updateTaskSubscription = this.userService
    .getAllUsers()
    .pipe(
      takeUntil(this.updateTaskNotifier)
    )
    .subscribe(
      (users: UserResponse[]) => this.users = users
    )
  }

  updateTask(): void {
    if(this.updateTaskForm.valid) {
      const value: TaskRequest = this.updateTaskForm.value
      const task: TaskRequest = {
        title: value.title,
        done: Boolean(Number(value.done)),
        order: Number(value.order),
        description: value.description,
        userId: value.userId
      }
      this.updateColumnDialogRef.close(task)
    }
  }

  close(): void {
    this.updateColumnDialogRef.close()
  }

  ngOnDestroy(): void {
    this.updateTaskNotifier.next();
    this.updateTaskNotifier.complete();
    this.updateTaskSubscription.unsubscribe();    
  }
}
