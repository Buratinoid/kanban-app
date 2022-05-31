import {ColumnRequest} from '../models/column-request';
import {ColumnResponse} from '../models/column-response';
import {Observable} from 'rxjs';
import {RequestService} from './request.service';
import {Injectable} from '@angular/core';

@Injectable()
export class ColumnService {

  constructor(private http: RequestService) {
  }

  public getAllColumns(boardId: string): Observable<ColumnResponse[]> {
    return this.http.getRequest('/boards/' + boardId + '/columns')
  }

  public createColumn(boardId: string, column: ColumnRequest): Observable<ColumnResponse> {
    return this.http.postRequest('/boards/' + boardId + '/columns', column)
  }

  public getColumn(boardId: string, columnId: string): Observable<ColumnResponse> {
    return this.http.getRequest('/boards/' + boardId + '/columns/' + columnId)
  }

  public deleteColumn(boardId: string, columnId: string): Observable<void> {
    return this.http.deleteRequest('/boards/' + boardId + '/columns/' + columnId)
  }

  public updateColumn(boardId: string, columnId: string, column: ColumnRequest): Observable<ColumnRequest> {
    return this.http.putRequest('/boards/' + boardId + '/columns/' + columnId, column)
  }
}
