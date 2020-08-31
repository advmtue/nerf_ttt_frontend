import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import GameMetadata from 'src/types/GameMetadata';
import LobbyPlayer from 'src/types/LobbyPlayer';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) { }

  login(loginInfo: { username: string, password: string }): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/auth/login`, loginInfo);
  }

  changePassword(loginInfo: { username: string, newPassword: string, defaultPassword: string }): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/auth/changepassword`, loginInfo);
  }

  createLobby(lobbyInfo: { name: string }): Observable<GameMetadata> {
    return this.httpClient.post<GameMetadata>(`${this.apiUrl}/lobby`, lobbyInfo);
  }

  getLobbies(): Observable<GameMetadata[]> {
    return this.httpClient.get<GameMetadata[]>(`${this.apiUrl}/lobby`);
  }

  closeLobby(lobbyId: string): Observable<{ lobbyId: string }> {
    return this.httpClient.post<{ lobbyId: string }>(`${this.apiUrl}/admin/lobby/close`, lobbyId);
  }

  getGameMetadata(lobbyId: string): Observable<GameMetadata> {
    return this.httpClient.get<GameMetadata>(`${this.apiUrl}/lobby/${lobbyId}`);
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

  startLobby(lobbyId: string): Observable<boolean> {
    return this.httpClient.patch<boolean>(`${this.apiUrl}/lobby/${lobbyId}/start`, {});
  }
}
