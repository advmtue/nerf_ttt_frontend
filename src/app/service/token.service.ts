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

	private buildTokenInfo() {
		this.tokenInfo = JSON.parse(atob(this.token.split('.')[1]));
		console.log(this.tokenInfo);
	}

	public userIsAdmin() {
		return this.tokenInfo.accessRole === "admin";
	}

	public getAccessRole() {
		return this.tokenInfo.accessRole;
	}

	public getUserId() {
		return this.tokenInfo.userId;
	}

	public getName() {
		return this.tokenInfo.name;
	}

	deleteToken() {
		this.userToken = undefined;
		localStorage.removeItem('userToken');
		this.tokenInfo = undefined;
		this.tokenStatus.next('NONE');
	}

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
