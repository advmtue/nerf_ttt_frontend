import { Injectable, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import LobbyPlayer from 'src/types/LobbyPlayer';
import * as socketio from 'socket.io-client';
import SocketMessage from 'src/types/SocketMessage';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private _io: SocketIOClient.Socket;
  public socketStatus: Subject<string> = new Subject<string>();

  constructor(@Inject('WEBSOCKET_URL') private _websocketUrl: string) {
    this._io = socketio(_websocketUrl, {autoConnect: false});

    this._io.on('disconnect', () => {
      this.socketStatus.next('DISCONNECT');
    })

    this._io.on('connect', () => {
      this.socketStatus.next('CONNECT');
    })

    this._io.connect();
  }

  /**
   * Notifies the socket server that the client wants updates for a 
   * given lobby id.
   *
   * @param lobbyId Lobby Id / Code
   */
  public joinLobby(lobbyId: string) {
    this._io.emit('joinLobby', {lobbyId});
  }

  /**
   * Notifies the socket server that the client no longer wants updates 
   * for a given lobby id.
   * 
   * @param lobbyId Lobby Id / Code
   */
  public leaveLobby(lobbyId: string) {
    this._io.emit('leaveLobby', {lobbyId});
  }

  /**
   * Notifies the socket server that the client wants updates for a
   * given game Id.
   * 
   * @param gameId Game Id
   */
  public joinGame(gameId: string) {
    this._io.emit('joinGame', {gameId});
  }

  /**
   * Notifies the socket server that the client no longer wants updates
   * for a given game Id.
   * 
   * @param gameId Game Id
   */
  public leaveGame(gameId: string) {
    this._io.emit('leaveGame', {gameId});
  }

  /**
   * Triggered whenever a player joins a lobby that the client is recieving
   * updates for.
   * 
   * @param lobbyId Lobby ID
   * @returns An observable emitting lobbyPlayers
   */
  public onLobbyPlayerJoin(lobbyId: string): Observable<LobbyPlayer> {
    return new Observable(sub => {
      this._io.on('lobbyPlayerJoin', (data: SocketMessage<LobbyPlayer>) => { 
        console.log(`[SOCKET] Got lobbyPlayerJoin`);
        if (data.scopeId === lobbyId) {
          sub.next(data.payload);
        }
      });
    })
  }

  /**
   * Triggered whenever a player leaves a lobby that the client is receiving
   * updates for
   * 
   * @param lobbyId Lobby ID
   * @returns An observable emitting player Id's
   */
  public onLobbyPlayerLeave(lobbyId: string): Observable<string> {
    return new Observable(sub => {
      this._io.on('lobbyPlayerLeave', (data: SocketMessage<string>) => { 
        if (data.scopeId === lobbyId) {
          sub.next(data.payload);
        }
      });
    })
  }

  /**
   * Triggered whenever a player readies up in a lobby the client is
   * recieving updates for.
   * 
   * @param lobbyId Lobby ID
   * @returns An observable emitting lobbyPlayers
   */
  public onLobbyPlayerReady(lobbyId: string): Observable<string> {
    return new Observable(sub => {
      this._io.on('lobbyPlayerReady', (data: SocketMessage<string>) => { 
        console.log(`[SOCKET] Got lobbyPlayerReady`);
        if (data.scopeId === lobbyId) {
          sub.next(data.payload);
        }
      });
    })
  }

  /**
   * Triggered whenever a player unreadies in a lobby the client is
   * recieving updates for.
   * 
   * @param lobbyId Lobby ID
   * @returns An observable emitting player Ids
   */
  public onLobbyPlayerUnready(lobbyId: string): Observable<string> {
    return new Observable(sub => {
      this._io.on('lobbyPlayerUnready', (data: SocketMessage<string>) => { 
        console.log(`[SOCKET] Got lobbyPlayerUnready`);
        if (data.scopeId === lobbyId) {
          sub.next(data.payload);
        }
      });
    })
  }
}
