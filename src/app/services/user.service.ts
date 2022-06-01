import {UserResponse} from '../models/user-response';
import {Observable} from 'rxjs';
import {RequestService} from './request.service';
import {Injectable} from '@angular/core';
import {SingUpRequest} from "../models/sing-up-request";

@Injectable()
export class UserService {

  constructor(private requestService: RequestService) {
  }

  public getAllUsers(): Observable<UserResponse[]> {
    return this.requestService.getRequest('/users')
  }

  public getUser(userId: string): Observable<UserResponse> {
    return this.requestService.getRequest('/users/' + userId)
  }

  public deleteUser(userId: string): Observable<void> {
    return this.requestService.deleteRequest('/users/' + userId)
  }

  public updateUser(userId: string, user: SingUpRequest): Observable<UserResponse> {
    return this.requestService.putRequest('/users/' + userId, user)
  }
}
