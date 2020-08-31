import { Component, OnInit, Input } from '@angular/core';
import GameMetadata from 'src/types/GameMetadata';

@Component({
  selector: 'app-pregame-page',
  templateUrl: './pregame-page.component.html',
  styleUrls: ['./pregame-page.component.scss']
})
export class PregamePageComponent implements OnInit {
  @Input() lobbyMetadata: GameMetadata;

  constructor() { }

  ngOnInit(): void {
  }

}
