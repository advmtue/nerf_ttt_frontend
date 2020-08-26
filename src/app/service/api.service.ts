import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ApiService {

	constructor(
		private httpClient: HttpClient,
		@Inject('API_URL') private apiUrl: string
	) { }

	postLogin(loginInfo: {username: string, password: string}): Observable<any> {
		return this.httpClient.post(`${this.apiUrl}/auth/login`, loginInfo);
	}

	postChangePassword(loginInfo: {username: string, newPassword: string, defaultPassword: string}): Observable<any> {
		return this.httpClient.post(`${this.apiUrl}/auth/changepassword`, loginInfo);
	}

	postCreateLobby(lobbyInfo: {name: string}): Observable<any> {
		return this.httpClient.post(`${this.apiUrl}/lobby`, lobbyInfo);
	}
}
