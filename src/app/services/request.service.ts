import {AuthService} from './auth.service';
import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, throwError} from 'rxjs';

@Injectable()
export class RequestService {

  private readonly url: string = 'http://localhost:8010/proxy';

  constructor(private httpClient: HttpClient, private authService: AuthService) {
  }

  public getRequest(path: string) {
    return this.httpClient.get<any>(this.url + path, {headers: this.getHeaders()})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('Error: ' + error.status + ' ' + error.statusText)
          return throwError(error)
        })
      )
  }

  public postRequest(path: string, body: any) {
    return this.httpClient.post<any>(this.url + path, body, {headers: this.getHeaders()})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('Error: ' + error.status + ' ' + error.statusText)
          return throwError(error)
        })
      )
  }

  public putRequest(path: string, body: any) {
    return this.httpClient.put<any>(this.url + path, body, {headers: this.getHeaders()})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('Error: ' + error.status + ' ' + error.statusText)
          return throwError(error)
        })
      )
  }

  public deleteRequest(path: string) {
    return this.httpClient.delete<any>(this.url + path, {headers: this.getHeaders()})
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
