import {Router} from '@angular/router';
import { Component, OnInit, } from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit { 

  public isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.authService.getIsLoggedIn()
    .subscribe((state: boolean) => this.isLoggedIn = state);
  }

  logOut(): void {
    this.authService.logOut()
    this.router.navigate(['signin'])
  }
}
