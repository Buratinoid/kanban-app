import {AuthService} from './auth.service';
import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, throwError} from 'rxjs';
import {Url} from '../models/url';

@Injectable()
export class RequestService {

  url: Url = new Url();

  constructor(
    private request: HttpClient,
    private auth: AuthService
  ) {
  }

  public getRequest(path: string) {
    const header = {'Authorization': 'Bearer ' + this.auth.getToken()}
    return this.request.get<any>(this.url.url + path, {headers: header})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('Error: ' + error.status + ' ' + error.statusText)
          return throwError(error)
        })
      )
  }

  public postRequest(path: string, body: any) {
    const header = {'Authorization': 'Bearer ' + this.auth.getToken()}
    return this.request.post<any>(this.url.url + path, body, {headers: header})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('Error: ' + error.status + ' ' + error.statusText)
          return throwError(error)
        })
      )
  }

  public putRequest(path: string, body: any) {
    const header = {'Authorization': 'Bearer ' + this.auth.getToken()}
    return this.request.put<any>(this.url.url + path, body, {headers: header})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('Error: ' + error.status + ' ' + error.statusText)
          return throwError(error)
        })
      )
  }

  public deleteRequest(path: string) {
    const header = {'Authorization': 'Bearer ' + this.auth.getToken()}
    return this.request.delete<any>(this.url.url + path, {headers: header})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('Error: ' + error.status + ' ' + error.statusText)
          return throwError(error)
        })
      )
  }
}
