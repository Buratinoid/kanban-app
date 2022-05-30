import { UserRequest } from './../../models/user-request';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {

  registrationForm: FormGroup;

  signUpSubscription: Subscription = new Subscription;

  constructor(
              private router: Router, 
              private http: UserService
              ) { 
    this.registrationForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  signUp(): void {
    if (this.registrationForm.valid) {
      const value = this.registrationForm.value;

      const user: UserRequest = {
        name: value.name,
        login: value.login,
        password: value.password
      }
      
      this.signUpSubscription = this.http
      .signUpUser(user)
      .subscribe(
        () => {
          console.log('Sign Up Complete')
          this.router.navigate(['signin'])
        })
    }
  }

  ngOnDestroy(): void {
    this.signUpSubscription.unsubscribe() //Почему ошибки, если включить??? Хз
  }
}