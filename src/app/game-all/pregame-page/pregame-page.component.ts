import { Component, OnInit, Input } from '@angular/core';
import GameInfo from 'src/types/GameInfo';
import GameMetadata from 'src/types/GameMetadata';

@Component({
  selector: 'app-pregame-page',
  templateUrl: './pregame-page.component.html',
  styleUrls: ['./pregame-page.component.scss']
})
export class PregamePageComponent implements OnInit {
  @Input() gameMetadata: GameMetadata;
  @Input() gameInfo: GameInfo;

  constructor() { }

  ngOnInit(): void {
  }

}
