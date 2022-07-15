import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Injectable} from '@angular/core';

import {Url} from '../models/url';
import {AuthorizationToken} from '../models/authorization-token';
import {SingInRequest} from '../models/sing-in-request';
import {SingUpRequest} from "../models/sing-up-request";
import {UserResponse} from "../models/user-response";

@Injectable()
export class AuthService {

  private readonly serverUrl: Url = new Url();

  private _authorizationToken: AuthorizationToken = {
    token: ''
  };
  private _isLoggedIn = new BehaviorSubject(false);
  private _userId = '';
  private _userLogin = '';

  constructor(
    private httpClient: HttpClient
  ) {
  }

  public signUpUser(singUpRequest: SingUpRequest): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(this.serverUrl.url + 'signup', singUpRequest)
  }

  public getUserToken(singInRequest: SingInRequest): Observable<AuthorizationToken> {
    return this.httpClient.post<AuthorizationToken>(this.serverUrl.url + 'signin', singInRequest);
  }

  public logOut(): void {
    this.token = '';
    this.setIsLoggedIn(false);
  }

  public get token(): string {
    return this._authorizationToken.token;
  }

  public set token(value: string) {
    this._authorizationToken.token = value;
  }

  public getIsLoggedIn(): Observable<boolean> {
    return this._isLoggedIn;
  }

  public setIsLoggedIn(state: boolean) {
    this._isLoggedIn.next(state);
  }

  public get userId(): string {
    return this._userId;
  }

  public set userId(value: string) {
    this._userId = value;
  }

  public get userLogin(): string {
    return this._userLogin
  }

  public set userLogin(value: string) {
    this._userLogin = value;
  }
}
