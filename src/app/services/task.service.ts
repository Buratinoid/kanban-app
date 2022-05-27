import { TaskRequest } from '../models/task-request';
import { TaskResponce } from '../models/task-responce';
import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { Observable } from 'rxjs';

@Injectable()
export class TaskService {

constructor(private http: RequestService) { }

public getAllTasks(boardId: string, columnId: string): Observable<TaskResponce[]> {
  return this.http.getRequest('/boards/' + boardId + '/columns/' + columnId + '/tasks')
}

public createTask(boardId: string, columnId: string, task: TaskRequest): Observable<TaskRequest> {
  return this.http.postRequest('/boards/' + boardId + '/columns/' + columnId + '/tasks', task)
}

public getTask(boardId: string, columnId: string, taskId: string): Observable<TaskResponce> {
  return this.http.getRequest('/boards/' + boardId + '/columns/' + columnId + '/tasks/' + taskId)
}

public deleteTask(boardId: string, columnId: string, taskId: string): Observable<void> {
  return this.http.deleteRequest('/boards/' + boardId + '/columns/' + columnId + '/tasks/' + taskId)
}

public updateTask(boardId: string, columnId: string, taskId: string, task: TaskRequest): Observable<TaskRequest> {
  return this.http.putRequest('/boards/' + boardId + '/columns/' + columnId + '/tasks/' + taskId, task)
}
}
