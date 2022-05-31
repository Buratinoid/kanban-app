import {UserRequest} from '../models/user-request';
import {UserResponse} from '../models/user-response';
import {Observable} from 'rxjs';
import {RequestService} from './request.service';
import {Injectable} from '@angular/core';

@Injectable()
export class UserService {

  constructor(private http: RequestService) {
  }

  public getAllUsers(): Observable<UserResponse[]> {
    return this.http.getRequest('/users')
  }

  public getUser(userId: string): Observable<UserResponse> {
    return this.http.getRequest('/users/' + userId)
  }

  public deleteUser(userId: string): Observable<void> {
    return this.http.deleteRequest('/users/' + userId)
  }

  public updateUser(userId: string, user: UserRequest): Observable<UserRequest> {
    return this.http.putRequest('/users/' + userId, user)
  }

  public signUpUser(user: UserRequest): Observable<UserRequest> {
    return this.http.postRequest('/signup', user)
  }
}
