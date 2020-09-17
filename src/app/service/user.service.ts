import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Profile from 'src/types/UserProfile';
import { ApiService } from './api.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _profile: Profile;

  // Authentication status : INIT | NONE | REGISTRATION | FULL
  public authStatus: BehaviorSubject<string> = new BehaviorSubject('INIT');

  constructor(private tokenService: TokenService, private apiService: ApiService) {
    // Listen for changes in access token
    this.tokenService.tokenStatus.subscribe(this.onTokenStatusChange.bind(this));
  }

  private onTokenStatusChange(newStatus: string) {
    switch (newStatus) {
      case 'NONE':
        this.authStatus.next('NONE');
        break;
      case 'REFRESH':
        this.onGetRefreshToken();
        break;
      case 'ACCESS':
        this.onGetAccessToken();
        break;
      default:
        console.log('[User] Unexpected access token status = ', newStatus);
    }
  }

  /**
   * Triggered when a refresh token is acquired by the token service.
   * Requests a new access token from the API.
   */
  private onGetRefreshToken() {
    console.log('[UserService] Got refresh token');
    console.log('[UserService] Requesting new access token');

    this.apiService.getAccessToken(this.tokenService.refreshToken).subscribe((response: { accessToken: string }) => {
      this.tokenService.accessToken = response.accessToken;
    });
  }

  public getNewAccessToken() {
    this.apiService.getAccessToken(this.tokenService.refreshToken).subscribe(response => {
      this.tokenService.accessToken = response.accessToken;
    })
  }

  /**
   * Triggered when an access token is acquired by the token service.
   * Requests a user profile for the current user
   */
  private onGetAccessToken() {
    console.log('[UserService] Got access token');
    console.log('[UserService] Requesting updated user profile');

    this.apiService.getUserMe().subscribe(profile => {
      this._profile = profile;
      console.log(this._profile);

      if (profile.accessLevel === 'registration') {
        this.authStatus.next('REGISTRATION');
      } else {
        this.authStatus.next('FULL');
      }
    });
  }

  get role() {
    return this._profile.accessLevel;
  }

  get id() {
    return this._profile.userId
  }

  get name() {
    return this._profile.displayName
  }

  public logout() {
    // TODO Revoke refresh token

    // Delete tokens
    this.tokenService.clear();

    // Delete profile
  }
}
