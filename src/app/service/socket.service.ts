import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GamePlayer, GamePlayerBasic } from 'src/types/Player';
import * as socketio from 'socket.io-client';
import SocketMessage from 'src/types/SocketMessage';
import GameKill from 'src/types/GameKill';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private _io: SocketIOClient.Socket;
  public socketStatus: BehaviorSubject<string> = new BehaviorSubject<string>('INIT');

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
   * Triggered whenever a player joins a game that the client is recieving
   * updates for.
   * 
   * @param lobbyId Game ID
   * @returns An observable emitting gamePlayers
   */
  public onGamePlayerJoin(gameId: string): Observable<GamePlayer> {
    return new Observable(sub => {
      this._io.on('gamePlayerJoin', (data: SocketMessage<GamePlayer>) => { 
        console.log(`[SOCKET] Got gamePlayerJoin`);

        if (data.scopeId === gameId) {
          sub.next(data.payload);
        }
      });
    })
  }

  /**
   * Triggered whenever a player leaves a game that the client is receiving
   * updates for
   * 
   * @param gameId Game ID
   * @returns An observable emitting player Id's
   */
  public onGamePlayerLeave(gameId: string): Observable<string> {
    return new Observable(sub => {
      this._io.on('gamePlayerLeave', (data: SocketMessage<string>) => { 

        if (data.scopeId === gameId) {
          sub.next(data.payload);
        }
      });
    })
  }

  /**
   * Triggered whenever a player readies up in a lobby the client is
   * recieving updates for.
   * 
   * @param gameId Lobby ID
   * @returns An observable emitting lobbyPlayers
   */
  public onGamePlayerReady(gameId: string): Observable<string> {
    return new Observable(sub => {
      this._io.on('gamePlayerReady', (data: SocketMessage<string>) => { 
        console.log(`[SOCKET] Got gamePlayerReady`);

        if (data.scopeId === gameId) {
          sub.next(data.payload);
        }
      });
    })
  }

  /**
   * Triggered whenever a player unreadies in a lobby the client is
   * recieving updates for.
   * 
   * @param gameId Lobby ID
   * @returns An observable emitting player Ids
   */
  public onGamePlayerUnready(gameId: string): Observable<string> {
    return new Observable(sub => {
      this._io.on('gamePlayerUnready', (data: SocketMessage<string>) => { 
        console.log(`[SOCKET] Got gamePlayerUnready`);

        if (data.scopeId === gameId) {
          sub.next(data.payload);
        }
      });
    })
  }

  /**
   * Triggered when a lobby closes that hte client is recieving updates for
   * 
   * @param gameId Lobby ID
   * @returns An observable emitting player Ids
   */
  public onGameClose(gameId: string): Observable<string> {
    return new Observable(sub => {
      this._io.on('gameClose', (data: SocketMessage<string>) => { 
        console.log(`[SOCKET] Got gameClose`);

        if (data.scopeId === gameId) {
          sub.next(data.payload);
        }
      });
    })
  }

  /**
   * Triggered when a lobby launches that the client is recieving updates for
   * 
   * @param gameId Lobby ID
   * @returns An observable emitting a gameId
   */
  public onGameLaunch(gameId: string): Observable<string> {
    return new Observable(sub => {
      this._io.on('gameLaunch', (data: SocketMessage<string>) => { 
        console.log(`[SOCKET] Got gameLaunch`);

        if (data.scopeId === gameId) {
          sub.next(data.payload);
        }
      });
    })
  }

  /**
   * Triggered when a game starts that the client is recieving updates for
   * 
   * @param lobbyId Game ID
   * @returns An observable emitting a gameId
   */
  public onGameStart(gameId: string): Observable<string> {
    return new Observable(sub => {
      this._io.on('gameStart', (data: SocketMessage<string>) => { 
        console.log(`[SOCKET] Got gameStart`);

        if (data.scopeId === gameId) {
          sub.next(data.payload);
        }
      });
    })
  }

  /**
   * Triggered when a game ends that the client is recieving updates for
   * 
   * @param lobbyId Lobby ID
   * @returns An observable emitting a gameId
   */
  public onGameEnd(gameId: string): Observable<{winningTeam: string, kills: GameKill[]}> {
    return new Observable(sub => {
      this._io.on('gameEnd', (data: SocketMessage<{winningTeam: string, kills: GameKill[]}>) => { 
        console.log(`[SOCKET] Got gameEnd`);
        if (data.scopeId === gameId) {
          sub.next(data.payload);
        }
      });
    })
  }

  /**
   * Triggered when a game goes to postpending that the client is recieving updates for
   * 
   * @param lobbyId Lobby ID
   * @returns An observable emitting a gameId
   */
  public onGamePostPending(gameId: string): Observable<GamePlayerBasic[]> {
    return new Observable(sub => {
      this._io.on('confirmKills', (data: SocketMessage<GamePlayerBasic[]>) => { 
        console.log(`[SOCKET] Got confirmKills`);
        if (data.scopeId === gameId) {
          sub.next(data.payload);
        }
      });
    })
  }

  /**
   * Triggered when a player confirms their killer in postpending phase
   * 
   * @param gameId Game ID
   * @returns An observable emitting user Ids
   */
  public onPlayerConfirmKiller(gameId: string): Observable<string> {
    return new Observable(sub => {
      this._io.on('playerConfirmKill', (data: SocketMessage<string>) => { 
        console.log(`[SOCKET] Got playerConfirmKill :${data.payload}`);

        if (data.scopeId === gameId) {
          sub.next(data.payload);
        }
      });
    })
  }
}
