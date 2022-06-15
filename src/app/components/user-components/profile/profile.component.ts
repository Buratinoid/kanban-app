import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Subscription, Subject, takeUntil, map} from 'rxjs';

import {AuthService} from '../../../services/auth.service';
import {UserService} from '../../../services/user.service';

import {DeleteConfirmComponent} from '../../../modals/delete-confirm/delete-confirm.component';

import {SingUpRequest} from '../../../models/sing-up-request';
import {UserResponse} from '../../../models/user-response';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  isHidePassword: boolean = true;
  usersResponse: UserResponse[] = [];
  userResponse: UserResponse = new UserResponse();

  userForm: FormGroup;
  userSubscription: Subscription = new Subscription;
  userNotifier: Subject<void> = new Subject();

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private matDialog: MatDialog,
    private router: Router
  ) {
    this.userForm = new FormGroup({
      login: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    this.userSubscription = this.userService
      .getAllUsers()
      .pipe(
        takeUntil(this.userNotifier),
        map((usersResponse: UserResponse[]) => {
          this.usersResponse = usersResponse;
          this.findUserByName();
          this.userForm.setValue({
            name: this.userResponse.name,
            login: this.userResponse.login,
            password: ''
          });
        })
      )
      .subscribe()
  }

  ngOnDestroy(): void {
    this.userNotifier.next();
    this.userNotifier.complete();
    this.userSubscription.unsubscribe();
  }

  findUserByName(): void {
    const userLogin: string = this.authService.userLogin
    this.usersResponse
      .find((userResponse: UserResponse) => {
        if (userResponse.login === userLogin) {
          this.userResponse = userResponse
        }
      })
  }

  updateUser(): void {
    if (this.userForm.valid) {
      const userRequest: SingUpRequest = this.userForm.value
      this.userSubscription = this.userService
        .updateUser(this.userResponse.id, userRequest)
        .pipe(
          takeUntil(this.userNotifier)
        )
        .subscribe(
          () => this.userForm.patchValue({password: ''})
        )
    }
  }

  deleteUser(userId: string): void {
    this.userSubscription = this.userService
      .deleteUser(userId)
      .pipe(
        takeUntil(this.userNotifier)
      )
      .subscribe(() => {
        this.authService.logOut()
        this.router.navigate([''])
      })
  }

  deleteUserModal(): void {
    const deleteUserDialogConfig = new MatDialogConfig();

    deleteUserDialogConfig.disableClose = true;
    deleteUserDialogConfig.autoFocus = false;

    const deleteUserDialogRef = this.matDialog.open(DeleteConfirmComponent, deleteUserDialogConfig)

    deleteUserDialogRef.afterClosed().subscribe(
      (deleteConfirm: boolean) => {
        if (deleteConfirm) {
          this.deleteUser(this.userResponse.id)
        }
      }
    )
  }
}
