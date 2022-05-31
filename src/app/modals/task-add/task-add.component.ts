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

  newTaskForm: FormGroup;

  constructor(
    private newTaskDialogRef: MatDialogRef<TaskAddComponent>
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
