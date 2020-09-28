import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { UserService } from 'src/app/service/user.service';
import GameInfo from 'src/types/GameInfo';

@Component({
  selector: 'app-pregame-page',
  templateUrl: './pregame-page.component.html',
  styleUrls: ['./pregame-page.component.scss']
})
export class PregamePageComponent implements OnInit {
  @Input() gameInfo: GameInfo;

  public shouldShowInfo = false;

  constructor(private _userService: UserService, private _apiService: ApiService) { }

  ngOnInit(): void {}

  hideInfo() {
    this.shouldShowInfo = false;
  }

  showInfo() {
    this.shouldShowInfo = true;
  }

  startGame() {
    this._apiService.startGame(this.gameInfo.code).subscribe()
  }

  public localPlayerIsGamemaster(): boolean {
    return this.gameInfo.ownerId === this._userService.id;
  }
}
