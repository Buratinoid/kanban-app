import { RequestService } from './request.service';
import { Injectable } from '@angular/core';

@Injectable()
export class TaskService {

constructor(private http: RequestService) { }

public getAllTasks(boardId: string, columnId: string) {
  return this.http.getRequest('/boards/' + boardId + '/columns/' + columnId + '/tasks')
}
}
