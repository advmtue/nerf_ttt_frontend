import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import LobbyMetadata from 'src/types/LobbyMetadata';
import LobbyPlayer from 'src/types/LobbyPlayer';

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

	postCreateLobby(lobbyInfo: {name: string}): Observable<LobbyMetadata> {
		return this.httpClient.post<LobbyMetadata>(`${this.apiUrl}/lobby`, lobbyInfo);
	}

	getLobbies(): Observable<LobbyMetadata[]> {
		return this.httpClient.get<LobbyMetadata[]>(`${this.apiUrl}/lobby`);
	}

	postCloseLobby(lobbyId: string): Observable<{lobbyId: string}> {
		return this.httpClient.post<{lobbyId: string}>(`${this.apiUrl}/admin/lobby/close`, lobbyId);
	}

	getLobby(lobbyId: string): Observable<LobbyMetadata> {
		return this.httpClient.get<LobbyMetadata>(`${this.apiUrl}/lobby/${lobbyId}`);
	}

	getLobbyPlayers(lobbyId: string): Observable<LobbyPlayer[]> {
		return this.httpClient.get<LobbyPlayer[]>(`${this.apiUrl}/lobby/${lobbyId}/players`);
	}

	joinLobby(lobbyId: string): Observable<boolean> {
		return this.httpClient.patch<boolean>(`${this.apiUrl}/lobby/${lobbyId}/join`, {});
	}

	leaveLobby(lobbyId: string): Observable<boolean> {
		return this.httpClient.patch<boolean>(`${this.apiUrl}/lobby/${lobbyId}/leave`, {});
	}

	setLobbyPlayerReady(lobbyId: string): Observable<boolean> {
		return this.httpClient.patch<boolean>(`${this.apiUrl}/lobby/${lobbyId}/ready`, {});
	}

	setLobbyPlayerUnready(lobbyId: string): Observable<boolean> {
		return this.httpClient.patch<boolean>(`${this.apiUrl}/lobby/${lobbyId}/unready`, {});
	}

}
