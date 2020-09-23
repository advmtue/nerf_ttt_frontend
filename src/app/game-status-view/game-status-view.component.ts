import { Component, Input, OnInit } from '@angular/core';
import GameMetadata from 'src/types/GameMetadata';

@Component({
  selector: 'app-game-status-view',
  templateUrl: './game-status-view.component.html',
  styleUrls: ['./game-status-view.component.scss']
})
export class GameStatusViewComponent implements OnInit {
  @Input() metadata: GameMetadata;

  constructor() { }

  ngOnInit(): void {
  }

}
