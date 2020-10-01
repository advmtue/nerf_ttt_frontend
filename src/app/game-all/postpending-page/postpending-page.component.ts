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

  constructor(
    private _apiService: ApiService,
    private _user: UserService
  ) { }

  ngOnInit(): void {
  }

  public waitingForLocalPlayer(): boolean {
    return this.gameInfo.waitingFor.find(p => p.userId === this._user.id) !== undefined;
  }

  public confirmKill(killer: GamePlayerBasic) {
    this._apiService.confirmKiller(this.gameInfo.code, killer.userId).subscribe();
  }

  public gamePlayersFiltered() {
    return this.gameInfo.gamePlayers.filter(p => p.userId !== this._user.id);
  }
}
