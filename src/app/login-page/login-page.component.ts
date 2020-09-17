import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { TokenService } from '../service/token.service';
import { UserService } from '../service/user.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup;
  showAllValidations = false;
  showError = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private userService: UserService,
    @Inject(DOCUMENT) private document: Document,
    @Inject('DISCORD_OAUTH_URL') private discordUrl: string,
  ) {
  }

  ngOnInit(): void {
    // Subscribe to user authentication level
    this.userService.authStatus.subscribe(newStatus => {
      if (newStatus === 'FULL') {
        this.router.navigate(['/lobbies']);
      }
    })
  }

  discordLogin() {
    document.location.href = this.discordUrl;
  }
}
