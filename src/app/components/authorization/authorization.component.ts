import { UserRequest } from './../../models/user-request';
import { Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit, OnDestroy {

  authorizationForm: FormGroup;

  signInSubscription: Subscription = new Subscription;

  constructor(private router:Router, private http: RequestService) {
    this.authorizationForm = new FormGroup({
        login: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
    })
   }

  ngOnInit(): void {
  }

  signIn(): void {
    if(this.authorizationForm.valid) {
      const value = this.authorizationForm.value;
      const sigInUser: UserRequest = {
        login: value.login,
        password: value.password
      }

    this.signInSubscription = this.http
    .signInUser(sigInUser)
    .subscribe(
      () => {
        console.log('Sign In Complete!')
        this.router.navigate(['kanban'])
      })
    }
  }
  
  ngOnDestroy(): void {
    this.signInSubscription.unsubscribe() //Почему ошибки, если включить??? Хз
  }
}
