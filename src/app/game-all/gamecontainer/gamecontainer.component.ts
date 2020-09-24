import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import GameMetadata from 'src/types/GameMetadata';
import { SocketService } from 'src/app/service/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gamecontainer',
  templateUrl: './gamecontainer.component.html',
  styleUrls: ['./gamecontainer.component.scss']
})
export class GamecontainerComponent implements OnInit, OnDestroy {
  public metadata: GameMetadata = null;
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
    if (this.metadata) {
      this._socketService.leaveGame(this.metadata.code);
    }

    this.subscriptions.unsubscribe();
  }

  private initializeGamestate(gameId: string) {
    // TODO Clean up these calls and see if it can be combined into just one
    this._apiService.getGameMetadata(gameId).subscribe({
      next: (lobbyData) => {
        if (lobbyData.status === 'CLOSED') {
          this._router.navigate(['/']);
          return;
        }

        console.log(lobbyData);
        this.metadata = lobbyData;
      },
      error: (error) => {
        if (error.error.code === "ERR_GAME_NOT_FOUND") {
          this._router.navigate(['/']);
        }
      }
    });

    // Listen for game start
    this.subscriptions.add(
      this._socketService.onGameStart(gameId).subscribe(state => {
        console.log('[GameContainer] Recieved game start event :', state);
        this.metadata.status = 'INGAME'; 
      })
    );

    // Listen for game end
    this.subscriptions.add(
      this._socketService.onGameEnd(gameId).subscribe(state => {
        console.log('[GameContainer] Recieved game end event :', state);
        this.metadata.status = 'POSTGAME';
      })
    );

    // Listen for game launch
    this.subscriptions.add(
      this._socketService.onGameLaunch(gameId).subscribe(state => {
        console.log('[GameContainer] Recieved game launch event :', state);
        this.metadata.status = 'PREGAME';
      })
    )

    // Listen for postpending
    this.subscriptions.add(
      this._socketService.onGamePostPending(gameId).subscribe(waitingList => {
        console.log('[GameContainer] Recieved game postpending event ');
        console.log(waitingList);

        this.metadata.status = 'POSTPENDING';
      })
    )

    // Join the game
    this._socketService.joinGame(gameId);
  }
}
