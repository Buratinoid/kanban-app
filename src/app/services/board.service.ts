import {BoardRequest} from '../models/board-request';
import {BoardResponse} from '../models/board-response';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RequestService} from './request.service';

@Injectable()
export class BoardService {

  constructor(private requestService: RequestService) {
  }

  public getAllBoards(): Observable<BoardResponse[]> {
    return this.requestService.getRequest('/boards');
  }

  public createBoard(
    board: BoardRequest): Observable<BoardResponse> {

    return this.requestService.postRequest('/boards', board)
  }

  public getBoard(
    boardId: string): Observable<BoardResponse> {

    return this.requestService.getRequest('/boards/' + boardId)
  }

  public deleteBoard(
    boardId: string): Observable<void> {

    return this.requestService.deleteRequest('/boards/' + boardId)
  }

  public updateBoard(
    boardId: string,
    board: BoardRequest): Observable<BoardResponse> {

    return this.requestService.putRequest('/boards/' + boardId, board)
  }
}
