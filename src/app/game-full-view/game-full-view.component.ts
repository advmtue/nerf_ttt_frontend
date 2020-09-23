import { Component, Input, OnInit } from '@angular/core';
import GameInfo from 'src/types/GameInfo';
import GameMetadata from 'src/types/GameMetadata';

@Component({
  selector: 'app-game-full-view',
  templateUrl: './game-full-view.component.html',
  styleUrls: ['./game-full-view.component.scss']
})
export class GameFullViewComponent implements OnInit {
  @Input() shouldShow: boolean;
  @Input() info: GameInfo;
  @Input() metadata: GameMetadata;

  constructor() { }

  ngOnInit(): void {
  }

  knownRoles() {
    return this.info.players.filter(p => p.role !== 'INNOCENT');
  }
}
