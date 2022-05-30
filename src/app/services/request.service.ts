import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class RequestService {
    
    private readonly url: string = 'http://localhost:8010/proxy';
    
    private token$: string = 'no token';
    public setToken(token: string): string {
        return this.token$ = token;
    }
    public getToken(): string {
        return this.token$;
    }
    
    constructor(private request: HttpClient) { }

public getRequest(path: string) {
    const header = {'Authorization': 'Bearer ' + this.getToken()}
    return this.request.get<any>(this.url + path, { headers: header })
    .pipe(
        catchError((error: HttpErrorResponse) => {
            console.log('Error: '+ error.status + ' ' + error.statusText)
            return throwError(error)
        })
    )
}

public postRequest(path: string, body: any) {
    const header = {'Authorization': 'Bearer ' + this.getToken()}
    return this.request.post<any>(this.url + path, body, { headers: header })
    .pipe(
        catchError((error: HttpErrorResponse) => {
            console.log('Error: '+ error.status + ' ' + error.statusText)
            return throwError(error)            
        })
    )
}

public putRequest(path: string, body: any) {
    const header = {'Authorization': 'Bearer ' + this.getToken()}
    return this.request.put<any>(this.url + path, body, { headers: header })
    .pipe(
        catchError((error: HttpErrorResponse) => {
            console.log('Error: '+ error.status + ' ' + error.statusText)
            return throwError(error)            
        })
    )
}

public deleteRequest(path: string) {
    const header = {'Authorization': 'Bearer ' + this.getToken()}
    return this.request.delete<any>(this.url + path, { headers: header })
    .pipe(
        catchError((error: HttpErrorResponse) => {
            console.log('Error: '+ error.status + ' ' + error.statusText)
            return throwError(error)            
        })
    )
}
}
