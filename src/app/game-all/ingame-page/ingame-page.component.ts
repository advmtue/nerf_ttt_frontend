import { Component, Input, OnInit } from '@angular/core';
import GameInfo from 'src/types/GameInfo';
import GameMetadata from 'src/types/GameMetadata';

@Component({
  selector: 'app-ingame-page',
  templateUrl: './ingame-page.component.html',
  styleUrls: ['./ingame-page.component.scss']
})
export class IngamePageComponent implements OnInit {
  @Input() gameInfo: GameInfo;
  @Input() gameMetadata: GameMetadata;

  shouldShowInfo = false;
  showDeathSelector = false;

  // Player (or "I don't know") who killed this player
  selectedKiller = null;

  constructor() { }

  ngOnInit(): void {
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
