import {Url} from '../models/url';
import {Token} from '../models/token';
import {HttpClient} from '@angular/common/http';
import {Observable, map} from 'rxjs';
import {UserRequest} from '../models/user-request';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthService {

  readonly url: Url = new Url();

  private token$: Token = new Token();
  private isLoggedIn$: boolean = false;

  constructor(
    private http: HttpClient
  ) {
  }

  private setToken(token: string): void {
    this.token$.token = token;
  }

  public getToken(): string {
    return this.token$.token;
  }

  public isLoggedIn(): boolean {
    return this.isLoggedIn$;
  }

  private setLoggedIn(isLoggedIn: boolean): void {
    this.isLoggedIn$ = isLoggedIn;
  }

  public signInUser(user: UserRequest): Observable<void> {
    return this.http.post<Token>(this.url.url + '/signin', user)
      .pipe(
        map((value: Token) => {
            this.setLoggedIn(true)
            return this.setToken(value.token)
          }
        )
      )
  }

  public logOut(): void {
    const emptyToken: string = '';
    this.setToken(emptyToken);
    this.setLoggedIn(false);
  }

}
