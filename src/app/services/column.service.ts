import {ColumnRequest} from '../models/column-request';
import {ColumnResponse} from '../models/column-response';
import {Observable} from 'rxjs';
import {RequestService} from './request.service';
import {Injectable} from '@angular/core';

@Injectable()
export class ColumnService {

  constructor(private requestService: RequestService) {
  }

  public getAllColumns(
    boardId: string): Observable<ColumnResponse[]> {

    return this.requestService.getRequest('/boards/' + boardId + '/columns')
  }

  public createColumn(
    boardId: string,
    column: ColumnRequest): Observable<ColumnResponse> {

    return this.requestService.postRequest('/boards/' + boardId + '/columns', column)
  }

  public getColumn(
    boardId: string,
    columnId: string): Observable<ColumnResponse> {

    return this.requestService.getRequest('/boards/' + boardId + '/columns/' + columnId)
  }

  public deleteColumn(
    boardId: string,
    columnId: string): Observable<void> {

    return this.requestService.deleteRequest('/boards/' + boardId + '/columns/' + columnId)
  }

  public updateColumn(
    boardId: string,
    columnId: string,
    column: ColumnRequest): Observable<ColumnResponse> {

    return this.requestService.putRequest('/boards/' + boardId + '/columns/' + columnId, column)
  }

  public updateColumnOrder(
    boardId: string,
    columnResponse: ColumnResponse): Observable<ColumnResponse> {

    const columnRequest: ColumnRequest = {
      title: columnResponse.title,
      order: columnResponse.order,
    }
    return this.requestService.putRequest('/boards/' + boardId + '/columns/' + columnResponse.id, columnRequest)
  }
}
