import {TaskRequest} from '../models/task-request';
import {TaskResponse} from '../models/task-response';
import {Injectable} from '@angular/core';
import {RequestService} from './request.service';
import {Observable} from 'rxjs';

@Injectable()
export class TaskService {

  constructor(private requestService: RequestService) {
  }

  public getAllTasks(
    boardId: string, 
    columnId: string
    ): Observable<TaskResponse[]> {

    return this.requestService.getRequest('/boards/' + boardId + '/columns/' + columnId + '/tasks')
  }

  public createTask(
    boardId: string, 
    columnId: string, 
    task: TaskRequest): Observable<TaskRequest> {

    return this.requestService.postRequest('/boards/' + boardId + '/columns/' + columnId + '/tasks', task)
  }

  public getTask(
    boardId: string, 
    columnId: string, 
    taskId: string): Observable<TaskResponse> {
      
    return this.requestService.getRequest('/boards/' + boardId + '/columns/' + columnId + '/tasks/' + taskId)
  }

  public deleteTask(
    boardId: string, 
    columnId: string, 
    taskId: string): Observable<void> {

    return this.requestService.deleteRequest('/boards/' + boardId + '/columns/' + columnId + '/tasks/' + taskId)
  }

  public updateTask(
    boardId: string, 
    columnId: string, 
    taskId: string, 
    task: TaskRequest): Observable<TaskResponse> {
      
    return this.requestService.putRequest('/boards/' + boardId + '/columns/' + columnId + '/tasks/' + taskId, task)
  }
}
