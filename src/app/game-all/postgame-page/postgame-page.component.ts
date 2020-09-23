import { Component, Input, OnInit } from '@angular/core';
import GameInfo from 'src/types/GameInfo';
import GameMetadata from 'src/types/GameMetadata';

@Component({
  selector: 'app-postgame-page',
  templateUrl: './postgame-page.component.html',
  styleUrls: ['./postgame-page.component.scss']
})
export class PostgamePageComponent implements OnInit {
  @Input() info: GameInfo;
  @Input() metadata: GameMetadata;

  constructor() { }

  ngOnInit(): void {
  }

}
