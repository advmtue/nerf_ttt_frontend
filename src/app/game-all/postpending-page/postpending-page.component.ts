import { Component, Input, OnInit } from '@angular/core';
import { kill } from 'process';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { SocketService } from 'src/app/service/socket.service';
import { UserService } from 'src/app/service/user.service';
import GameInfo, { GamePlayerBasic } from 'src/types/GameInfo';
import GameMetadata from 'src/types/GameMetadata';
import GamePlayer from 'src/types/GamePlayer';

@Component({
  selector: 'app-postpending-page',
  templateUrl: './postpending-page.component.html',
  styleUrls: ['./postpending-page.component.scss']
})
export class PostpendingPageComponent implements OnInit {
  @Input() metadata: GameMetadata;
  
  awaitingKills: GamePlayerBasic[] = [];
  subscriptions: Subscription = new Subscription();
  info: GameInfo;

  constructor(
    private _apiService: ApiService,
    private _socket: SocketService,
    private _user: UserService
  ) { }

  ngOnInit(): void {
    this._apiService.getWaitingKillConfirmation(this.metadata.code).subscribe(players => {
      this.awaitingKills = players;
    })

    this._apiService.getGameInfo(this.metadata.code).subscribe(info => this.info = info);

    this.subscriptions.add(
      this._socket.onPlayerConfirmKiller(this.metadata.code).subscribe(playerId => {
        this.awaitingKills = this.awaitingKills.filter(pl => pl.userId !== playerId);
      })
    )
  }

  public waitingForLocalPlayer(): boolean {
    return this.awaitingKills.find(p => p.userId === this._user.id) !== null;
  }

  public confirmKill(killer: GamePlayerBasic) {
    this._apiService.confirmKiller(this.metadata.code, killer.userId).subscribe();
  }
}
