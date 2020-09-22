import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
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

  public shouldShowInfo = false;

  constructor(private _userService: UserService) { }

  ngOnInit(): void {
  }

  hideInfo() {
    this.shouldShowInfo = false;
  }

  showInfo() {
    this.shouldShowInfo = true;
  }

  startGame() {
    console.log('Game start or something idk lmwo ');
  }

  public localPlayerIsGamemaster(): boolean {
    return this.gameMetadata.ownerId === this._userService.id;
  }
}
