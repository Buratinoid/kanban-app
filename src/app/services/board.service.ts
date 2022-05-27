import { Board } from './../models/board';
import { BoardAPI } from './../APImodels/boardAPI';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from './request.service';

@Injectable()
export class BoardService {

constructor(private http: RequestService) { }

public getAllBoards(): Observable<Board[]> {
  return this.http.getRequest('/boards');
}

public createBoard(board: BoardAPI): Observable<Board> {
  return this.http.postRequest('/boards', board)
}

public getBoard(boardId: string): Observable<Board> {
  return this.http.getRequest('/boards/' + boardId)
}

public deleteBoard(boardId: string): Observable<Board> {
  return this.http.deleteRequest('/boards/' + boardId)
}

public updateBoard(boardId: string, board: Board): Observable<Board> {
  return this.http.putRequest('/boards/' + boardId, board)
}
}