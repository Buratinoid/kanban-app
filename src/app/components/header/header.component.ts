import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
              private router: Router, 
              private http: AuthService
              ) { }

  ngOnInit(): void {
  }

  logOut(): void {
    this.http.logOut()
    this.router.navigate(['signin'])
  }
}
