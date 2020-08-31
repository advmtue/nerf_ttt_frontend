import { Component, OnInit, Input } from '@angular/core';
import GameMetadata from 'src/types/GameMetadata';

@Component({
  selector: 'app-launching-page',
  templateUrl: './launching-page.component.html',
  styleUrls: ['./launching-page.component.scss']
})
export class LaunchingPageComponent implements OnInit {
  @Input() lobbyMetadata: GameMetadata;

  constructor() { }

  ngOnInit(): void {
  }

}
