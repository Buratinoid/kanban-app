import { Observable } from 'rxjs';
import { RequestService } from './request.service';
import { Injectable } from '@angular/core';
import { Column } from '../models/column';

@Injectable()
export class ColumnService {

constructor(private http: RequestService) { }

public getAllColumns(boardId: string): Observable<Column[]> {
  return this.http.getRequest('/boards/' + boardId + '/columns')
}

public createColumn(boardId: string, column: Column): Observable<Column> {
  return this.http.postRequest('/boards/' + boardId + '/columns', column)
}

public getColumn(boardId: string, columnId: string): Observable<Column> {
  return this.http.getRequest('/boards/' + boardId + '/columns/' + columnId)
}

public deleteColumn(boardId: string, columnId: string): Observable<Column> {
  return this.http.deleteRequest('/boards/' + boardId + '/columns/' + columnId)
}

public updateColumn(boardId: string, columnId: string, column: Column): Observable<Column> {
  return this.http.putRequest('/boards/' + boardId + '/columns/' + columnId, column)
}
}
