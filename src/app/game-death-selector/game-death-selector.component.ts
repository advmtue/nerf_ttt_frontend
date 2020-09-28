import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from 'protractor';
import { Subject } from 'rxjs';
import { GamePlayerBasic } from 'src/types/Player';

@Component({
  selector: 'app-game-death-selector',
  templateUrl: './game-death-selector.component.html',
  styleUrls: ['./game-death-selector.component.scss']
})
export class GameDeathSelectorComponent implements OnInit {
  @Input() players: GamePlayerBasic[];
  @Input() showUnknown: boolean = true;

  @Output() confirmKiller: Subject<GamePlayerBasic> = new Subject();
  @Output() cancel: Subject<boolean> = new Subject();

  selectedPlayer: GamePlayerBasic = null;
  unknownPlayer: GamePlayerBasic = { userId: "UNKNOWN", displayName: "I don't know", role: "INNOCENT" };

  constructor() { }

  ngOnInit(): void {
    this.players.sort((a, b) => a.displayName < b.displayName ? 0 : 1);
  }

  goBack() {
    this.cancel.next(true);
  }

  select(player: GamePlayerBasic) {
    this.selectedPlayer = player;
  }

  confirm() {
    this.confirmKiller.next(this.selectedPlayer);
  }
}
