import { RequestService } from './request.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ColumnService {

constructor(private http: RequestService) { }

public getAllColumns(boardId: string) {
  return this.http.getRequest('/boards/' + boardId + '/columns')
}

public createColumn(boardId: string, column: any) {
  return this.http.postRequest('/boards/' + boardId + '/columns', column)
}

public getColumn(boardId: string, columnId: string) {
  return this.http.getRequest('/boards/' + boardId + '/columns/' + columnId)
}

public deleteColumn(boardId: string, columnId: string) {
  return this.http.deleteRequest('/boards/' + boardId + '/columns/' + columnId)
}

public updateColumn(boardId: string, columnId: string, column: any) {
  return this.http.putRequest('/boards/' + boardId + '/columns/' + columnId, column)
}
}
