import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './service/token.service';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Nerf TTT';

  // Instantiate the user service as early as possible
  // User service will also invoke a token service
  constructor(
    private userService: UserService
  ) { }
}
