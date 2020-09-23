import { Component, Input, OnInit } from '@angular/core';
import GameInfo from 'src/types/GameInfo';
import GameMetadata from 'src/types/GameMetadata';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-game-full-view',
  templateUrl: './game-full-view.component.html',
  styleUrls: ['./game-full-view.component.scss']
})
export class GameFullViewComponent implements OnInit {
  @Input() shouldShow: boolean;
  @Input() info: GameInfo;
  @Input() metadata: GameMetadata;

  constructor(private _apiService: ApiService) { }

  ngOnInit(): void {
    this._apiService.getGameInfo(this.metadata.code).subscribe(info => {
      console.log(info);
      this.info = info;
    })
  }

  knownRoles() {
    return this.info.players.filter(p => p.role !== 'INNOCENT');
  }
}
