import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
              private router: Router, 
              private http: UserService
              ) { }

  ngOnInit(): void {
  }

  logOut(): void {
    this.http.logOut()
    this.router.navigate(['signin'])
  }
}
