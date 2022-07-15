import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {UserService} from 'src/app/services/user.service';

import {UserResponse} from '../../models/user-response';
import {TaskRequest} from '../../models/task-request';
import {TaskResponse} from '../../models/task-response';
import {TaskCondition} from '../../models/task-condition';

@Component({
  selector: 'app-task-update',
  templateUrl: './task-update.component.html',
  styleUrls: ['./task-update.component.css']
})
export class TaskUpdateComponent implements OnInit {

  usersList: UserResponse[] = [];
  taskCondition = new TaskCondition();
  updateTaskForm: FormGroup;

  constructor(
    private userService: UserService,
    private updateColumnDialogRef: MatDialogRef<TaskUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) taskResponse: TaskResponse
  ) {
    this.updateTaskForm = new FormGroup({
      title: new FormControl(taskResponse.title, [Validators.required]),
      done: new FormControl(Number(taskResponse.done), [Validators.pattern(/[0-1]/), Validators.required]),
      order: new FormControl(taskResponse.order, [Validators.required]),
      description: new FormControl(taskResponse.description, [Validators.required]),
      userId: new FormControl(taskResponse.userId, [Validators.required])
    })
  }

  ngOnInit(): void {
    this.usersList = this.userService.users
  }

  updateTask(): void {
    if (this.updateTaskForm.valid) {
      const value: TaskRequest = this.updateTaskForm.value
      const taskRequest: TaskRequest = {
        title: value.title,
        done: Boolean(Number(value.done)),
        order: Number(value.order),
        description: value.description,
        userId: value.userId
      }
      this.updateColumnDialogRef.close(taskRequest)
    }
  }

  close(): void {
    this.updateColumnDialogRef.close()
  }
}
