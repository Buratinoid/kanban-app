import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
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

  subscription: Subscription = new Subscription;

  userSignIn = {
    name: '',
    login: '',
    password: ''
  }

  constructor(private router: Router, private http: UserService) { 
    this.registrationForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
  }

  signUp() {
    if (this.registrationForm.valid) {
      const value: {
        name: string,
        login: string,
        password: string
      } = this.registrationForm.value;

      this.userSignIn.name = value.name
      this.userSignIn.login = value.login
      this.userSignIn.password = value.password

      
      this.subscription = this.http
      .signUpUser(this.userSignIn)
      .subscribe(
        () => {
          console.log('Sign Up Complete')
          this.router.navigate(['signin'])
        })
    }
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe() //Почему ошибки, если включить??? Хз
  }
}