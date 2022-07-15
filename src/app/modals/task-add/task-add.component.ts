import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

import {UserService} from '../../services/user.service';

import {UserResponse} from '../../models/user-response';
import {TaskRequest} from '../../models/task-request';
import {TaskCondition} from '../../models/task-condition';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.css']
})
export class TaskAddComponent implements OnInit {

  usersList: UserResponse[] = [];
  taskCondition = new TaskCondition();

  newTaskForm: FormGroup;

  constructor(
    private newTaskDialogRef: MatDialogRef<TaskAddComponent>,
    private userService: UserService
  ) {
    this.newTaskForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      done: new FormControl('', [Validators.pattern(/[0-1]/), Validators.required]),
      description: new FormControl('', [Validators.required]),
      userId: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    this.usersList = this.userService.users
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
