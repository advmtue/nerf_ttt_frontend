import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import GameMetadata from 'src/types/GameMetadata';
import LobbyPlayer from 'src/types/LobbyPlayer';
import Profile from 'src/types/UserProfile';
import LobbyMetadata from 'src/types/LobbyMetadata';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) { }

  discordAuth(code: string): Observable<{ refreshToken: string }> {
    return this.httpClient.get<{ refreshToken: string }>(`${this.apiUrl}/auth/discord?code=${code}`);
  }

  getAccessToken(refreshToken: string): Observable<{ accessToken: string }> {
    return this.httpClient.post<{ accessToken: string }>(`${this.apiUrl}/auth/token`, { refreshToken: refreshToken });
  }

  getUserMe(): Observable<Profile> {
    return this.httpClient.get<Profile>(`${this.apiUrl}/user/@me`);
  }

  register(displayName: string): Observable<{ success: boolean }> {
    return this.httpClient.post<{ success: boolean }>(`${this.apiUrl}/user/@register`, { name: displayName });
  }

  createLobby(lobbyInfo: { name: string }): Observable<LobbyMetadata> {
    return this.httpClient.post<LobbyMetadata>(`${this.apiUrl}/lobby`, lobbyInfo);
  }

  getLobbyMetadata(lobbyId: string): Observable<LobbyMetadata> {
    return this.httpClient.get<LobbyMetadata>(`${this.apiUrl}/lobby/${lobbyId}`);
  }

  closeLobby(lobbyId: string): Observable<{ lobbyId: string }> {
    return this.httpClient.delete<{ lobbyId: string }>(`${this.apiUrl}/lobby/${lobbyId}`);
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
