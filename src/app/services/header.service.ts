import {Injectable} from '@angular/core';

@Injectable()
export class HeaderService {

  private _boardName: string = '';
  private _isKanbanIn: boolean = false;
  private _isBoardIn: boolean = false;

  constructor() {
  }

  public get boardName(): string {
    return this._boardName
  }

  public set boardName(boardName: string) {
    this._boardName = boardName
  }

  public get isKanbanIn(): boolean {
    return this._isKanbanIn
  }

  public set isKanbanIn(state: boolean) {
    this._isKanbanIn = state
  }

  public get isBoardIn(): boolean {
    return this._isBoardIn
  }

  public set isBoardIn(state: boolean) {
    this._isBoardIn = state
  }
}
