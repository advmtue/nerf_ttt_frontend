import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-status-view',
  templateUrl: './game-status-view.component.html',
  styleUrls: ['./game-status-view.component.scss']
})
export class GameStatusViewComponent implements OnInit {
  @Input() gameState: string;

  constructor() { }

  ngOnInit(): void {
  }

}
