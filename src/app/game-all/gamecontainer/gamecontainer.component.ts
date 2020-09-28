import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { SocketService } from 'src/app/service/socket.service';
import { Subscription } from 'rxjs';
import GameInfo from 'src/types/GameInfo';

@Component({
  selector: 'app-gamecontainer',
  templateUrl: './gamecontainer.component.html',
  styleUrls: ['./gamecontainer.component.scss']
})
export class GamecontainerComponent implements OnInit, OnDestroy {
  public subscriptions = new Subscription();
  public gameInfo: GameInfo = null;
  public gameId: string;

  constructor(
    private _route: ActivatedRoute,
    private _apiService: ApiService,
    private _router: Router,
    private _socketService: SocketService
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.gameId = params.gameid;
      console.log(`Found gameId = ${this.gameId}`);

      this.initializeGamestate();
    });
  }

  ngOnDestroy(): void {
    if (this.gameInfo) {
      this._socketService.leaveGame(this.gameInfo.code);
    }

    this.subscriptions.unsubscribe();
  }

  getInfo() {
    this._apiService.getGameInfo(this.gameId).subscribe(
      info => {
        this.gameInfo = info;

        if (this.gameInfo.status === 'INGAME' || this.gameInfo.status === 'PREGAME') {
          this.gameInfo.gamePlayers.push({ userId: "1234", displayName: "Alcy Meehan", role: "DETECTIVE" });
          this.gameInfo.gamePlayers.push({ userId: "1234", displayName: "Liam Salamy", role: "INNOCENT" });
          this.gameInfo.gamePlayers.push({ userId: "1234", displayName: "Jordan Combridge", role: "INNOCENT" });
          this.gameInfo.gamePlayers.push({ userId: "1234", displayName: "Ben Peel", role: "INNOCENT" });
        }

        console.log(this.gameInfo);
      },
      error => {
        if (error.error.code === "ERR_GAME_NOT_FOUND") {
          this._router.navigate(['/']);
        }
      }
    )
  }

  private initializeGamestate() {
    this.getInfo();

    // Listen for game start
    this.subscriptions.add(
      this._socketService.onGameStart(this.gameId).subscribe(state => {
        console.log('[GameContainer] Recieved game start event :', state);
        this.gameInfo.status = 'INGAME';
      })
    );

    // Listen for game end
    this.subscriptions.add(
      this._socketService.onGameEnd(this.gameId).subscribe(state => {
        console.log('[GameContainer] Recieved game end event :');
        console.log(state);
        this.gameInfo.status = 'POSTGAME';
      })
    );

    // Listen for game launch
    this.subscriptions.add(
      this._socketService.onGameLaunch(this.gameId).subscribe(state => {
        console.log('[GameContainer] Recieved game launch event :', state);
        this.gameInfo.status = 'PREGAME';
        this.getInfo();
      })
    )

    // Listen for postpending
    this.subscriptions.add(
      this._socketService.onGamePostPending(this.gameId).subscribe(waitingList => {
        console.log('[GameContainer] Recieved game postpending event ');
        console.log(waitingList);

        this.gameInfo.status = 'POSTPENDING';
        this.gameInfo.waitingFor = waitingList;
      })
    )

    // Join the game
    this._socketService.joinGame(this.gameId);
  }
}
