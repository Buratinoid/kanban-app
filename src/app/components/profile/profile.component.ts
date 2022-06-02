import { Router } from '@angular/router';
import { DeleteConfirmComponent } from './../../modals/delete-confirm/delete-confirm.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SingUpRequest } from './../../models/sing-up-request';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Subscription, Subject, takeUntil, map } from 'rxjs';
import { UserResponse } from './../../models/user-response';
import { UserService } from './../../services/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  usersResponse: UserResponse[] = [];

  userResponse: any //??? Ошибка с типами из-за .find (говорит про | undefined)
  // userResponse: UserResponse = new UserResponse(); 

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
    const userLogin: string = this.authService.userLogin
    this.userSubscription = this.userService
    .getAllUsers()
    .pipe(
      takeUntil(this.userNotifier),
      map((usersResponse: UserResponse[]) => {
        this.usersResponse = usersResponse
        this.userResponse = this.usersResponse.find((userResponse: UserResponse) => userResponse.login === userLogin)
        this.userForm.setValue({
          name: this.userResponse.name,
          login: this.userResponse.login,
          password: ''
          })
      })
    )
    .subscribe()
  }

  ngOnDestroy(): void {
    this.userNotifier.next();
    this.userNotifier.complete();
    this.userSubscription.unsubscribe();
  }

  getUserById(): void {
    this.userSubscription = this.userService
    .getUser(this.userResponse.id)
    .pipe(
      takeUntil(this.userNotifier)
    )
    .subscribe(
      (userResponse: UserResponse) => this.userResponse = userResponse     
    )
  }

  updateUser(): void {
    if(this.userForm.valid) {
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
        if (deleteConfirm === true) {
          this.deleteUser(this.userResponse.id)
        }
      }
    )
  }
}
