import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import GameInfo, { GamePlayerBasic } from 'src/types/GameInfo';
import GameMetadata from 'src/types/GameMetadata';

@Component({
  selector: 'app-ingame-page',
  templateUrl: './ingame-page.component.html',
  styleUrls: ['./ingame-page.component.scss']
})
export class IngamePageComponent implements OnInit {
  @Input() metadata: GameMetadata;

  shouldShowInfo = false;
  showDeathSelector = false;
  info: GameInfo = null;

  // Player (or "I don't know") who killed this player
  selectedKiller = null;

  constructor(private _apiService: ApiService) { }

  ngOnInit(): void {
    // Get game filtered information
    this._apiService.getGameInfo(this.metadata.code).subscribe(gameInfo => {
      console.log(gameInfo);
      this.info = gameInfo

      // TODO REMOVE
      this.info.players.push({userId: "1234", name: "Alcy Meehan", role: "DETECTIVE"});
      this.info.players.push({userId: "1234", name: "Liam Salamy", role: "INNOCENT"});
      this.info.players.push({userId: "1234", name: "Jordan Combridge", role: "INNOCENT"});
      this.info.players.push({userId: "1234", name: "Ben Peel", role: "INNOCENT"});
    });
  }

  showInfo() {
    this.shouldShowInfo = true;
  }

  hideInfo() {
    this.shouldShowInfo = false;
  }

  startConfirmDeath() {
    this.showDeathSelector = true;
  }

  confirmKiller(player: GamePlayerBasic) {
    this._apiService.confirmKiller(this.metadata.code, player.userId).subscribe(() => {
      console.log(player);
      this.showDeathSelector = false;
      this.info.alive = false;
    });
  }

  cancelConfirm() {
    this.showDeathSelector = false;
  }
}
