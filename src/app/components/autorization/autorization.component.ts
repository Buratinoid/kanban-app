import { Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-autorization',
  templateUrl: './autorization.component.html',
  styleUrls: ['./autorization.component.css']
})
export class AutorizationComponent implements OnInit, OnDestroy {

  autorizationForm: FormGroup;

  subscription: Subscription = new Subscription;

  userSignUp = {
    login: '',
    password: ''
  }

  constructor(private router:Router, private http: RequestService) {
    this.autorizationForm = new FormGroup({
        login: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
    })
   }

  ngOnInit() {
  }

  signIn() {
    if(this.autorizationForm.valid) {
      const value: {
         login: string,
         password: string   
      } = this.autorizationForm.value;
    

    this.userSignUp.login = value.login
    this.userSignUp.password = value.password

    this.subscription = this.http
    .signInUser(this.userSignUp)
    .subscribe(
      () => {
        console.log('Sign In Complete!')
        this.router.navigate(['kanban'])
      })
    }
  }
  
  ngOnDestroy() {
    // this.subscription.unsubscribe() //Почему ошибки, если включить??? Хз
  }
}
