import { Component, OnInit, Input } from '@angular/core';
import LobbyMetadata from 'src/types/LobbyMetadata';

@Component({
  selector: 'app-game-metadata-view',
  templateUrl: './game-metadata-view.component.html',
  styleUrls: ['./game-metadata-view.component.scss']
})
export class GameMetadataViewComponent implements OnInit {
  @Input() lobbyMetadata: LobbyMetadata;

  constructor() { }

  ngOnInit(): void {
  }

}
