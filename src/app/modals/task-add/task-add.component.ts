import {TaskCondition} from '../../models/task-condition';
import {UserService} from '../../services/user.service';
import {UserResponse} from '../../models/user-response';
import {Subscription, Subject, takeUntil} from 'rxjs';
import {MatDialogRef} from '@angular/material/dialog';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {TaskRequest} from '../../models/task-request';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.css']
})
export class TaskAddComponent implements OnInit {

  taskCondition = new TaskCondition();

  usersResponse: UserResponse[] = [];

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
        (usersResponse: UserResponse[]) => this.usersResponse = usersResponse
      )
  }

  newTask(): void {
    if (this.newTaskForm.valid) {
      const value: TaskRequest = this.newTaskForm.value
      const taskRequest: TaskRequest = {
        title: value.title,
        done: Boolean(Number(value.done)),
        order: 0,
        description: value.description,
        userId: value.userId
      }
      this.newTaskDialogRef.close(taskRequest)
    }
  }

  close(): void {
    this.newTaskDialogRef.close()
  }
}
