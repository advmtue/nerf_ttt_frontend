import { Component, Input, OnInit } from '@angular/core';
import GameInfo from 'src/types/GameInfo';

@Component({
  selector: 'app-game-status-view',
  templateUrl: './game-status-view.component.html',
  styleUrls: ['./game-status-view.component.scss']
})
export class GameStatusViewComponent implements OnInit {
  @Input() gameInfo: GameInfo;

  constructor() { }

  ngOnInit(): void {
  }

}
