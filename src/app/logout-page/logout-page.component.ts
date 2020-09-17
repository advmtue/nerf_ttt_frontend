import { Component, OnInit } from '@angular/core';
import { TokenService } from '../service/token.service';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-logout-page',
  templateUrl: './logout-page.component.html',
  styleUrls: ['./logout-page.component.scss']
})
export class LogoutPageComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // If the token gets updated to NONE then navigate back to login page

    this.userService.authStatus.subscribe((status: string) => {
      if (status === 'NONE') {
        this.router.navigate(['/login']);
      }
    });

    // Logout
    this.userService.logout();
  }
}
