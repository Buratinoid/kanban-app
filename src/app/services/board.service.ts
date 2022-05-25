import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestService } from './request.service';

@Injectable()
export class BoardService {

constructor(private http: RequestService) { }

public getAllBoards(): Observable<any> {
  return this.http.getRequest('/boards')
}

public createBoard(board: any): Observable<any> {
  return this.http.postRequest('/boards', board)
}

public getBoard(boardId: string) {
  return this.http.getRequest('/boards/' + boardId)
}
}