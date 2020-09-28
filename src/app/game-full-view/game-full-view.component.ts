import { Component, Input, OnInit } from '@angular/core';
import GameInfo from 'src/types/GameInfo';

@Component({
  selector: 'app-game-full-view',
  templateUrl: './game-full-view.component.html',
  styleUrls: ['./game-full-view.component.scss']
})
export class GameFullViewComponent implements OnInit {
  @Input() shouldShow: boolean;
  @Input() gameInfo: GameInfo;

  constructor() { }

  ngOnInit(): void {}

  knownRoles() {
    return this.gameInfo.gamePlayers.filter(p => p.role !== 'INNOCENT');
  }
}
