import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import TokenInfo from 'src/types/TokenInfo';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private userToken: string | undefined;
  private tokenInfo: TokenInfo | undefined;
  tokenStatus: BehaviorSubject<string> = new BehaviorSubject('INITIALIZING');

  constructor() {
    // Pull token from localStorage if possible
    const tok = localStorage.getItem('userToken');

    if (tok === null) {
      // No token in localstorage
      this.userToken = undefined;
    } else {
      // Assign token and build information
      this.userToken = tok;

      this.buildTokenInfo();

      this.tokenStatus.next('ACQUIRED');
    }
  }

  /**
   * Extra info from the JWT
   */
  private buildTokenInfo() {
    this.tokenInfo = JSON.parse(atob(this.token.split('.')[1]));
    console.log(this.tokenInfo);
  }

  /** Check the token claims for accessRole === 'admin' */
  public userIsAdmin() {
    if (!this.tokenInfo) { return false; }

    return this.tokenInfo.accessRole === 'admin';
  }

  /** Pull the accessRole claim from the token */
  public getAccessRole() {
    if (!this.tokenInfo) { return 'user'; }

    return this.tokenInfo.accessRole;
  }

  /** Pull the userId claim from the token */
  public getUserId() {
    if (!this.tokenInfo) { return 'none'; }

    return this.tokenInfo.userId;
  }

  /** Pull the name claim from the token */
  public getName() {
    if (!this.tokenInfo) { return 'unknown'; }

    return this.tokenInfo.name;
  }

  /** Clear the token and it's persistence */
  deleteToken() {
    this.userToken = undefined;
    localStorage.removeItem('userToken');
    this.tokenInfo = undefined;
    this.tokenStatus.next('NONE');
  }

  /** Pull token info */
  get token() {
    return this.userToken;
  }

  set token(userToken: string) {
    this.userToken = userToken;
    this.buildTokenInfo();

    localStorage.setItem('userToken', userToken);
    this.tokenStatus.next('ACQUIRED');
  }
}
