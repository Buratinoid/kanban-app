import {Injectable} from '@angular/core';
import {Observable, tap} from 'rxjs';

import {BoardRequest} from '../models/board-request';
import {BoardResponse} from '../models/board-response';

import {RequestService} from './request.service';

@Injectable()
export class BoardService {

  private _boardsArray: BoardResponse[] = [];

  constructor(private requestService: RequestService) {
  }

  public getAllBoards(): Observable<BoardResponse[]> {
    return this.requestService.getRequest('/boards')
      .pipe(
        tap((boards: BoardResponse[]) => this._boardsArray = boards)
      )
  }

  public createBoard(board: BoardRequest): Observable<BoardResponse> {
    return this.requestService.postRequest('/boards', board)
      .pipe(
        tap(newBoard => this._boardsArray.push(newBoard))
      )
  }

  public getBoard(boardId: string): Observable<BoardResponse> {
    return this.requestService.getRequest('/boards/' + boardId)
  }

  public deleteBoard(deletedBoardId: string, deletedBoard: BoardResponse): Observable<void> {
    const deletedBoardIndex = this._boardsArray.indexOf(deletedBoard)
    return this.requestService.deleteRequest('/boards/' + deletedBoardId)
      .pipe(
        tap(() => this._boardsArray.splice(deletedBoardIndex, 1))
      )
  }

  public updateBoard(updatedBoardId: string, updatedBoard: BoardRequest): Observable<BoardResponse> {
    return this.requestService.putRequest('/boards/' + updatedBoardId, updatedBoard)
      .pipe(
        tap((updatedBoardResponse: BoardResponse) => {
          this._boardsArray.find((board: BoardResponse) => {
            if (board.id === updatedBoardId) {
              board.title = updatedBoardResponse.title
              board.description = updatedBoardResponse.description
            }
          })
        })
      )
  }

  public get boardsArray(): BoardResponse[] {
    return this._boardsArray
  }

  public set boardsArray(boardsArray: BoardResponse[]) {
    this._boardsArray = boardsArray
  }
}
