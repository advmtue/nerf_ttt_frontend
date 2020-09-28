import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import GameInfo from 'src/types/GameInfo';
import { GamePlayerBasic } from 'src/types/Player';

@Component({
  selector: 'app-ingame-page',
  templateUrl: './ingame-page.component.html',
  styleUrls: ['./ingame-page.component.scss']
})
export class IngamePageComponent implements OnInit {
  @Input() gameInfo: GameInfo;

  shouldShowInfo = false;
  showDeathSelector = false;

  // Player (or "I don't know") who killed this player
  selectedKiller = null;

  constructor(private _apiService: ApiService) { }

  ngOnInit(): void {
    // Get game filtered information
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
    this._apiService.confirmKiller(this.gameInfo.code, player.userId).subscribe(() => {
      console.log(player);

      this.showDeathSelector = false;
      this.gameInfo.localPlayer.isAlive = false;
    });
  }

  cancelConfirm() {
    this.showDeathSelector = false;
  }
}
