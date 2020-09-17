import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import TokenInfo from 'src/types/TokenInfo';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private _accessToken: string | null = null;
  private _refreshToken: string | null = null;

  // Token Lifecycles : INIT | NONE | REFRESH | ACCESS
  public tokenStatus: BehaviorSubject<string> = new BehaviorSubject('INIT');

  constructor() {
    // Pull refresh token from storage if possible
    // We don't save the access token, just generate a new one per session
    const refreshToken = localStorage.getItem('nerf_ttt_refresh_token');

    if (refreshToken === null) {
      this.tokenStatus.next('NONE');
    } else {
      this._refreshToken = refreshToken;
      this.tokenStatus.next('REFRESH');
    }
  }

  get accessToken() {
    return this._accessToken;
  }

  get refreshToken() {
    return this._refreshToken;
  }

  set accessToken(newToken: string | null) {
    // Null value indicates the token is being deleted
    if (newToken === null) {
      this._accessToken = null;

      // If the refresh token has also been deleted
      if (this._refreshToken === null) {
        this.tokenStatus.next('NONE');
      } else {
        this.tokenStatus.next('REFRESH')
      }
    } else {
      this._accessToken = newToken;
      this.tokenStatus.next('ACCESS');
    }
  }

  /**
   * Set refresh token
   */
  set refreshToken(newToken: string | null) {
    if (newToken === null) {
      this._refreshToken = null;
      localStorage.removeItem('nerf_ttt_refresh_token');
      this.tokenStatus.next('NONE');
    } else {
      this._refreshToken = newToken;
      localStorage.setItem('nerf_ttt_refresh_token', newToken);
      this.tokenStatus.next('REFRESH');
    }
  }

  // Clear state
  public clear() {
    this.accessToken = null;
    this.refreshToken = null;
  }
}
