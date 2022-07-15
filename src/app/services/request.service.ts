import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, throwError} from 'rxjs';

import {AuthService} from './auth.service';

import {Url} from '../models/url';

@Injectable()
export class RequestService {

  private readonly serverUrl: Url = new Url();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
  }

  public getRequest(path: string) {
    return this.httpClient.get<any>(this.serverUrl.url + path, {headers: this.getHeaders()})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('Error: ' + error.status + ' ' + error.statusText)
          return throwError(error)
        })
      )
  }

  public postRequest(path: string, body: any) {
    return this.httpClient.post<any>(this.serverUrl.url + path, body, {headers: this.getHeaders()})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('Error: ' + error.status + ' ' + error.statusText)
          return throwError(error)
        })
      )
  }

  public putRequest(path: string, body: any) {
    return this.httpClient.put<any>(this.serverUrl.url + path, body, {headers: this.getHeaders()})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('Error: ' + error.status + ' ' + error.statusText)
          return throwError(error)
        })
      )
  }

  public deleteRequest(path: string) {
    return this.httpClient.delete<any>(this.serverUrl.url + path, {headers: this.getHeaders()})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('Error: ' + error.status + ' ' + error.statusText)
          return throwError(error)
        })
      )
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
  }
}
