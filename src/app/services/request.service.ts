import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError, map } from 'rxjs';

@Injectable()
export class RequestService {
    
    private url: string = 'http://localhost:8010/proxy';
    private token: string = 'no token';
    
    constructor(private request: HttpClient) { }

public getRequest(path: string) {
    const header = {'Authorization': 'Bearer ' + this.token}
    return this.request.get<any>(this.url + path, { headers: header })
    .pipe(
        catchError(error => {
            console.log('Error: '+ error.error.statusCode + ' ' + error.error.message)
            return throwError(error)
        })
    )
}

public postRequest(path: string, body: any) {
    const header = {'Authorization': 'Bearer ' + this.token}
    return this.request.post<any>(this.url + path, body, { headers: header })
    .pipe(
        catchError(error => {
            console.log('Error: '+ error.error.statusCode + ' ' + error.error.message)
            return throwError(error)            
        })
    )
}

public putRequest(path: string, body: any) {
    const header = {'Authorization': 'Bearer ' + this.token}
    return this.request.put<any>(this.url + path, body, { headers: header })
    .pipe(
        catchError(error => {
            console.log('Error: '+ error.error.statusCode + ' ' + error.error.message)
            return throwError(error)            
        })
    )
}

public deleteRequest(path: string) {
    const header = {'Authorization': 'Bearer ' + this.token}
    return this.request.delete<any>(this.url + path, { headers: header })
    .pipe(
        catchError(error => {
            console.log('Error: '+ error.error.statusCode + ' ' + error.error.message)
            return throwError(error)            
        })
    )
}

public signUpUser(body: any): Observable<any> {
    return this.postRequest('/signup', body)
}

public signInUser(body: any): Observable<any> {
    return this.postRequest('/signin', body)
    .pipe(
        map(value => this.token = value.token),
        catchError(error => {
            console.log('Error: '+ error.error.statusCode + ' ' + error.error.message)
            return throwError(error)
        })
    )
}

public getAllUsers(): Observable<any> {
    return this.getRequest('/users')
}

public logOut() {
    this.token = 'logout token';
}

public showToken() {
    console.log(this.token);
}
}
