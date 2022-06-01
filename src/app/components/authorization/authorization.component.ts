import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {SingInRequest} from '../../models/sing-in-request';
import {AuthorizationStatus} from "../../models/authorization-status";
import {take} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";


@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit, OnDestroy {

  authorizationForm: FormGroup;
  authorizationStatus: AuthorizationStatus = new AuthorizationStatus(false);

  constructor(private router: Router, private authService: AuthService) {
    this.authorizationForm = new FormGroup({
      login: new FormControl('', [Validators.required]),
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
          take(1)
        )
        .subscribe(
          (token: string) => {
            this.authService.token = token;
            this.authService.isLoggedIn = true;
            this.authorizationStatus = new AuthorizationStatus(true);
            this.router.navigate(['kanban'])
          },
          (error: HttpErrorResponse) => {
            this.authService.token = '';
            this.authService.isLoggedIn = false;
            this.authorizationStatus = new AuthorizationStatus(false, error.status.toString(), error.message)
          }
        )
    }
  }

  ngOnDestroy(): void {

  }
}
