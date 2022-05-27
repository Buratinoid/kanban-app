import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError, map } from 'rxjs';

@Injectable()
export class RequestService {
    
    private readonly url: string = 'http://localhost:8010/proxy';
    
    private token$: string = 'no token';
    private setToken(token: string): string {
        return this.token$ = token;
    }
    private getToken(): string {
        return this.token$;
    }
    
    constructor(private request: HttpClient) { }

public getRequest(path: string) {
    const header = {'Authorization': 'Bearer ' + this.getToken()}
    return this.request.get<any>(this.url + path, { headers: header })
    .pipe(
        catchError(error => {
            console.log('Error: '+ error.error.statusCode + ' ' + error.error.message)
            return throwError(error)
        })
    )
}

public postRequest(path: string, body: any) {
    const header = {'Authorization': 'Bearer ' + this.getToken()}
    return this.request.post<any>(this.url + path, body, { headers: header })
    .pipe(
        catchError(error => {
            console.log('Error: '+ error.error.statusCode + ' ' + error.error.message)
            return throwError(error)            
        })
    )
}

public putRequest(path: string, body: any) {
    const header = {'Authorization': 'Bearer ' + this.getToken()}
    return this.request.put<any>(this.url + path, body, { headers: header })
    .pipe(
        catchError(error => {
            console.log('Error: '+ error.error.statusCode + ' ' + error.error.message)
            return throwError(error)            
        })
    )
}

public deleteRequest(path: string) {
    const header = {'Authorization': 'Bearer ' + this.getToken()}
    return this.request.delete<any>(this.url + path, { headers: header })
    .pipe(
        catchError(error => {
            console.log('Error: '+ error.error.statusCode + ' ' + error.error.message)
            return throwError(error)            
        })
    )
}

public signInUser(body: any): Observable<any> {
    return this.postRequest('/signin', body)
    .pipe(
        map(value => this.setToken(value.token)),
        catchError(error => {
            console.log('Error: '+ error.error.statusCode + ' ' + error.error.message)
            return throwError(error)
        })
    )
}

public logOut() {
    this.setToken('no token');
}

public showToken() {
    console.log(this.getToken());
}
}
