import { AuthorizationToken } from './../models/authorization-token';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SingInRequest} from '../models/sing-in-request';
import {Injectable} from '@angular/core';
import {SingUpRequest} from "../models/sing-up-request";
import {UserResponse} from "../models/user-response";

@Injectable()
export class AuthService {

  private readonly url: string = 'http://localhost:8010/proxy/';

  private _authorizationToken: AuthorizationToken = {
    token: ''
  };
  private _isLoggedIn = false;
  private _userId = '';
  private _userLogin = '';

  constructor(
    private httpClient: HttpClient
    ) {
  }

  public signUpUser(singUpRequest: SingUpRequest): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(this.url + 'signup', singUpRequest)
  }

  public getUserToken(singInRequest: SingInRequest): Observable<AuthorizationToken> {
    return this.httpClient.post<AuthorizationToken>(this.url + 'signin', singInRequest);
  }

  public logOut(): void {
    this.token = '';
    this.isLoggedIn = false;
  }

  public get token(): string {
    return this._authorizationToken.token;
  }

  public set token(value: string) {
    this._authorizationToken.token = value;
  }

  public get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  public set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
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
