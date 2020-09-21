import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import GameMetadata from 'src/types/GameMetadata';
import { SocketService } from 'src/app/service/socket.service';
import { Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';
import GamePlayerInfo from 'src/types/GameInfo';

@Component({
  selector: 'app-gamecontainer',
  templateUrl: './gamecontainer.component.html',
  styleUrls: ['./gamecontainer.component.scss']
})
export class GamecontainerComponent implements OnInit, OnDestroy {
  public gameData: GameMetadata = null;
  public gameInfo: GamePlayerInfo = null;

  public subscriptions = new Subscription();

  constructor(
    private _route: ActivatedRoute,
    private _apiService: ApiService,
    private _router: Router,
    private _socketService: SocketService
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      const gameId = params.gameid;
      console.log(`Found gameId = ${gameId}`);

      // TODO Add subscription for game status changes

      this.initializeGamestate(gameId);
    });
  }

  ngOnDestroy(): void {
    if (this.gameData) {
      this._socketService.leaveGame(this.gameData.gameId);
    }

    this.subscriptions.unsubscribe();
  }

  private initializeGamestate(gameId: string) {
    // TODO Clean up these calls and see if it can be combined into just one
    this._apiService.getGameMetadata(gameId).subscribe(lobbyData => {
      if (lobbyData.status === 'CLOSED') {
        this._router.navigate(['/']);
        return;
      }

      console.log(lobbyData);
      this.gameData = lobbyData;
    });

    this._apiService.getGameInfo(gameId).subscribe(gameInfo => {
      console.log(gameInfo);
      this.gameInfo = gameInfo;
    });

    // Listen for game start
    this.subscriptions.add(
      this._socketService.onGameStart(gameId).subscribe(state => {
        console.log('[GameContainer] Recieved game start event :', state);
        this.gameData.status = 'INGAME'; 
      })
    );

    // Listen for game end
    this.subscriptions.add(
      this._socketService.onGameEnd(gameId).subscribe(state => {
        console.log('[GameContainer] Recieved game end event :', state);
        this.gameData.status = 'POSTGAME';
      })
    );

    // Join the game
    this._socketService.joinGame(gameId);
  }
}
