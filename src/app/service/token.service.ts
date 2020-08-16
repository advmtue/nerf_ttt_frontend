import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class TokenService {
	private userToken: string;
	tokenStatus: BehaviorSubject<string> = new BehaviorSubject('INITIALIZING');

	constructor() {
		// Pull token from local if possible
		const tok = localStorage.getItem('userToken');
		if (tok === null) {
			this.userToken = undefined;
		} else {
			this.userToken = tok;
			this.tokenStatus.next('ACQUIRED');
		}
	}

	deleteToken() {
		this.userToken = undefined;
		localStorage.removeItem('userToken');
		this.tokenStatus.next('NONE');
	}

	get token() {
		return this.userToken;
	}

	set token(userToken: string) {
		this.userToken = userToken;
		localStorage.setItem('userToken', userToken);
		this.tokenStatus.next('ACQUIRED');
	}
}
