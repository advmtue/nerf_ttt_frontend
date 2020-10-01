import { Component, Input, OnInit } from '@angular/core';
import GameInfo from 'src/types/GameInfo';

@Component({
  selector: 'app-postgame-page',
  templateUrl: './postgame-page.component.html',
  styleUrls: ['./postgame-page.component.scss']
})
export class PostgamePageComponent implements OnInit {
  @Input() gameInfo: GameInfo;

  constructor() { }

  ngOnInit(): void {
    this.gameInfo.kills.forEach(k => k.killTime = (parseInt(k.killTime) - parseInt(this.gameInfo.dateStarted)).toString());

    this.configureKillTimeStrings();
    console.log(this.gameInfo);
  }

  private secondsToMinutesSeconds(totalSeconds: number): string {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60; 

    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
  }

  configureKillTimeStrings()
  {
    this.gameInfo.kills.forEach(kill => {
      kill.killTime = this.secondsToMinutesSeconds(Math.floor(parseInt(kill.killTime) / 1000));
    });
  }
}
