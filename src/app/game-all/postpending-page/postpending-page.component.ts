import { Component, Input, OnInit } from '@angular/core';
import { kill } from 'process';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { SocketService } from 'src/app/service/socket.service';
import { UserService } from 'src/app/service/user.service';
import GameInfo from 'src/types/GameInfo';
import { GamePlayerBasic } from 'src/types/Player';

@Component({
  selector: 'app-postpending-page',
  templateUrl: './postpending-page.component.html',
  styleUrls: ['./postpending-page.component.scss']
})
export class PostpendingPageComponent implements OnInit {
  @Input() gameInfo: GameInfo;
  
  subscriptions: Subscription = new Subscription();
  info: GameInfo;

  constructor(
    private _apiService: ApiService,
    private _socket: SocketService,
    private _user: UserService
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this._socket.onPlayerConfirmKiller(this.gameInfo.code).subscribe(playerId => {
        this.gameInfo.waitingFor = this.gameInfo.waitingFor.filter(pl => pl.userId !== playerId);
      })
    )
  }

  public waitingForLocalPlayer(): boolean {
    return this.gameInfo.waitingFor.find(p => p.userId === this._user.id) !== null;
  }

  public confirmKill(killer: GamePlayerBasic) {
    this._apiService.confirmKiller(this.gameInfo.code, killer.userId).subscribe();
  }

  public gamePlayersFiltered() {
    return this.gameInfo.waitingFor.filter(p => p.userId !== this._user.id);
  }
}
