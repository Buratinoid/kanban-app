import { Observable } from 'rxjs';
import { RequestService } from './request.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

constructor(private http: RequestService) { }

public signUpUser(body: any): Observable<any> {
  return this.http.postRequest('/signup', body)
}

}
