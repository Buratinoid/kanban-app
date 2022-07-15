import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from "@angular/common/http";
import {Subject, takeUntil} from 'rxjs';

import {AuthService} from '../../../services/auth.service';

import {AuthorizationStatus} from "../../../models/authorization-status";
import {AuthorizationToken} from '../../../models/authorization-token';
import {SingInRequest} from '../../../models/sing-in-request';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit, OnDestroy {

  isHidePassword: boolean = true;

  authorizationForm: FormGroup;
  authorizationStatus: AuthorizationStatus = new AuthorizationStatus(false);
  authorizationNotifier: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.authorizationForm = new FormGroup({
      login: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required])
    })

  }

  ngOnInit(): void {
  }

  signIn(): void {
    if (this.authorizationForm.valid) {
      const singInRequest: SingInRequest =
        new SingInRequest(this.authorizationForm.value.login, this.authorizationForm.value.password);
      this.authService.getUserToken(singInRequest)
        .pipe(
          takeUntil(this.authorizationNotifier)
        )
        .subscribe(
          (authorizationToken: AuthorizationToken) => {
            this.authService.token = authorizationToken.token;
            this.authService.setIsLoggedIn(true);
            this.authorizationStatus = new AuthorizationStatus(true);
            this.authService.userLogin = this.authorizationForm.value.login
            this.router.navigate(['kanban'])
          },
          (error: HttpErrorResponse) => {
            this.authService.token = '';
            this.authService.setIsLoggedIn(false);
            this.authorizationStatus = new AuthorizationStatus(false, error.status.toString(), error.message);
            this.authService.userLogin = '';
          }
        )
    }
  }

  ngOnDestroy(): void {
    this.authorizationNotifier.next();
    this.authorizationNotifier.complete();
  }
}
