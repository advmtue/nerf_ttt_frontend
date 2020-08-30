import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import GameMetadata from 'src/types/GameMetadata';

@Component({
  selector: 'app-gamecontainer',
  templateUrl: './gamecontainer.component.html',
  styleUrls: ['./gamecontainer.component.scss']
})
export class GamecontainerComponent implements OnInit {
  public gameData: GameMetadata = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const gameId = params['gameid'];
      console.log(`Found gameId = ${gameId}`);

      this.initializeGamestate(gameId);
    })
  }

  private initializeGamestate(gameId: string) {
    this.apiService.getGameMetadata(gameId).subscribe(lobbyData => {
      if (lobbyData.status === 'CLOSED') {
        this.router.navigate(['/']);
        return;
      }

      console.log(lobbyData);
      this.gameData = lobbyData;
    });
  }
}
