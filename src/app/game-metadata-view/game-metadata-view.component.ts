import { Component, OnInit, Input } from '@angular/core';
import GameMetadata from 'src/types/GameMetadata';

@Component({
  selector: 'app-game-metadata-view',
  templateUrl: './game-metadata-view.component.html',
  styleUrls: ['./game-metadata-view.component.scss']
})
export class GameMetadataViewComponent implements OnInit {
  @Input() metadata: GameMetadata;

  constructor() { }

  ngOnInit(): void {
  }

}
