import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import GameInfo from 'src/types/GameInfo';
import GameMetadata from 'src/types/GameMetadata';

@Component({
  selector: 'app-ingame-page',
  templateUrl: './ingame-page.component.html',
  styleUrls: ['./ingame-page.component.scss']
})
export class IngamePageComponent implements OnInit {
  @Input() info: GameInfo;
  @Input() metadata: GameMetadata;

  shouldShowInfo = false;
  showDeathSelector = false;

  // Player (or "I don't know") who killed this player
  selectedKiller = null;

  constructor(private _apiService: ApiService) { }

  ngOnInit(): void {
    // Get game filtered information
    this._apiService.getGameInfo(this.metadata.code).subscribe(gameInfo => this.info = gameInfo);
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

  confirmDeath(killerId: string): void {
    // API call
  }
}
