import {Router} from '@angular/router';
import {Subscription, takeUntil, Subject} from 'rxjs';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UserRequest} from '../../models/user-request';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit, OnDestroy {

  authorizationForm: FormGroup;

  signInSubscription: Subscription = new Subscription;

  signInNotifier: Subject<void> = new Subject();

  constructor(private router: Router, private http: AuthService) {
    this.authorizationForm = new FormGroup({
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
  }

  signIn(): void {
    if (this.authorizationForm.valid) {
      const value: UserRequest = this.authorizationForm.value;
      const sigInUser: UserRequest = {
        login: value.login,
        password: value.password
      }

      this.signInSubscription = this.http
        .signInUser(sigInUser)
        .pipe(
          takeUntil(this.signInNotifier)
        )
        .subscribe(
          () => {
            console.log('Sign In Complete!')
            this.router.navigate(['kanban'])
          })
    }
  }

  ngOnDestroy(): void {
    this.signInNotifier.next();
    this.signInNotifier.complete();
    this.signInSubscription.unsubscribe();
  }
}
