import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {SingUpRequest} from "../../models/sing-up-request";
import {AuthService} from "../../services/auth.service";
import {take} from "rxjs/operators";
import {UserResponse} from "../../models/user-response";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {

  registrationForm: FormGroup;

  constructor(
    private router: Router, 
    private authService: AuthService
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
      const singUpRequest: SingUpRequest = new SingUpRequest(
        this.registrationForm.value.name,
        this.registrationForm.value.login,
        this.registrationForm.value.password);

      this.authService.signUpUser(singUpRequest)
        .pipe(
          take(1))
        .subscribe(
          (userResponse: UserResponse) => {
            this.authService.userId = userResponse.id;
            this.router.navigate(['signin'])
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
    }
  }

  ngOnDestroy(): void {
  }
}
