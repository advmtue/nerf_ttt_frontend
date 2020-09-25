import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import GameMetadata from 'src/types/GameMetadata';
import GamePlayer from 'src/types/GamePlayer';
import Profile from 'src/types/UserProfile';
import { pluck } from 'rxjs/operators';
import GameInfo, { GamePlayerBasic } from 'src/types/GameInfo';

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

  createLobby(): Observable<GameMetadata> {
    return this.httpClient.post<GameMetadata>(`${this.apiUrl}/game`, {});
  }

  getGameMetadata(lobbyId: string): Observable<GameMetadata> {
    return this.httpClient.get<GameMetadata>(`${this.apiUrl}/game/${lobbyId}`);
  }

  closeLobby(lobbyId: string): Observable<{ lobbyId: string }> {
    return this.httpClient.delete<{ lobbyId: string }>(`${this.apiUrl}/game/${lobbyId}`);
  }

  getGameInfo(gameId: string): Observable<GameInfo> {
    return this.httpClient.get<GameInfo>(`${this.apiUrl}/game/${gameId}/info`);
  }

  getLobbyPlayers(lobbyId: string): Observable<GamePlayer[]> {
    return this.httpClient.get<GamePlayer[]>(`${this.apiUrl}/game/${lobbyId}/players`);
  }

  joinLobby(lobbyId: string): Observable<boolean> {
    return this.httpClient.get<{ success: boolean }>(`${this.apiUrl}/game/${lobbyId}/join`).pipe<boolean>(pluck('success'));
  }

  leaveLobby(lobbyId: string): Observable<boolean> {
    return this.httpClient.get<{ success: boolean }>(`${this.apiUrl}/game/${lobbyId}/leave`).pipe<boolean>(pluck('success'));
  }

  setLobbyPlayerReady(lobbyId: string): Observable<boolean> {
    return this.httpClient.get<{ success: boolean }>(`${this.apiUrl}/game/${lobbyId}/ready`).pipe(pluck('success'));
  }

  setLobbyPlayerUnready(lobbyId: string): Observable<boolean> {
    return this.httpClient.get<{ success: boolean }>(`${this.apiUrl}/game/${lobbyId}/unready`).pipe(pluck('success'));
  }

  launchGame(lobbyId: string): Observable<string> {
    return this.httpClient.get<string>(`${this.apiUrl}/game/${lobbyId}/launch`);
  }

  startGame(gameId: string): Observable<void> {
    return this.httpClient.get<void>(`${this.apiUrl}/game/${gameId}/start`);
  }

  confirmKiller(gameId: string, killerId: string): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/game/${gameId}/confirmkiller`, {killerId});
  }

  getWaitingKillConfirmation(gameId: string): Observable<GamePlayerBasic[]> {
    return this.httpClient.get<GamePlayerBasic[]>(`${this.apiUrl}/game/${gameId}/waiting_kill_confirmation`);
  }
}
