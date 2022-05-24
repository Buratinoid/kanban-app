import { RequestService } from './../services/request.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private http: RequestService) { }

  ngOnInit() {
  }

  logOut() {
    this.http.logOut()
    this.router.navigate(['signin'])
  }
}
