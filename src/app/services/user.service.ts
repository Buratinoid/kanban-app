import { Observable } from 'rxjs';
import { RequestService } from './request.service';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

constructor(private http: RequestService) { }

public signUpUser(body: any): Observable<any> {
  return this.http.postRequest('/signup', body)
}

public getAllUsers(): Observable<any> {
  return this.http.getRequest('/users')
}

public getUser(userId: string) {
  return this.http.getRequest('/users/' + userId)
}

}
