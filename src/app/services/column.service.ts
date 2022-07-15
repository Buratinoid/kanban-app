import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

import {RequestService} from './request.service';

import {ColumnRequest} from '../models/column-request';
import {ColumnResponse} from '../models/column-response';

@Injectable()
export class ColumnService {

  constructor(private requestService: RequestService) {
  }

  public getAllColumns(boardId: string): Observable<ColumnResponse[]> {
    return this.requestService.getRequest('/boards/' + boardId + '/columns')
  }

  public createColumn(boardId: string, column: ColumnRequest): Observable<ColumnResponse> {
    return this.requestService.postRequest('/boards/' + boardId + '/columns', column)
  }

  public getColumn(boardId: string, columnId: string): Observable<ColumnResponse> {
    return this.requestService.getRequest('/boards/' + boardId + '/columns/' + columnId)
  }

  public deleteColumn(boardId: string, columnId: string): Observable<void> {
    return this.requestService.deleteRequest('/boards/' + boardId + '/columns/' + columnId)
  }

  public updateColumn(boardId: string, columnId: string, column: ColumnRequest): Observable<ColumnResponse> {
    return this.requestService.putRequest('/boards/' + boardId + '/columns/' + columnId, column)
  }

  public updateColumnOrder(boardId: string, column: ColumnResponse): Observable<ColumnResponse> {
    const columnRequest: ColumnRequest = {
      title: column.title,
      order: column.order,
    }
    return this.requestService.putRequest('/boards/' + boardId + '/columns/' + column.id, columnRequest)
  }
}
