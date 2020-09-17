import { Component, OnInit, ɵɵqueryRefresh } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { TokenService } from '../service/token.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private tokenService: TokenService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    // Watch for authentication level changes. If the user authenticates,
    // route to the appropriate page for their level of access.
    // REGISTRATION = /register
    // FULL = /lobbies
    this.userService.authStatus.subscribe(newStatus => {
      if (newStatus === 'REGISTRATION') {
        this.router.navigate(['/register']);
      } else if (newStatus === 'FULL') {
        this.router.navigate(['/lobbies']);
      }
    })

    // Access query parameters for OAuth codes
    this.route.queryParams.subscribe(params => {
      // Ensure that query parameters are available
      // If the params are not set, fail and redirect back to the login page
      if (!params.ref || !params.code) {
        console.log('[AuthComponent] Failed to get query parameters');
        this.router.navigate(['/login']);
        return;
      }

      // Discord authentication process
      if (params.ref === 'discord') {
        this.performDiscordLogin(params.code);
      }
    })
  }

  /**
   * Perform discord OAuth flow
   * @param code Discord authentication ephemeral code
   */
  private performDiscordLogin(code: string) {
    console.log('[AuthComponent] Performing Discord OAuth2 Flow');
    this.api.discordAuth(code).subscribe(refreshTokenResponse => {
      this.tokenService.refreshToken = refreshTokenResponse.refreshToken;
    });
  }
}
