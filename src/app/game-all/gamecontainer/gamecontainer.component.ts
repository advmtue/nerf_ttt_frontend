import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import LobbyMetadata from 'src/types/LobbyMetadata';

@Component({
  selector: 'app-gamecontainer',
  templateUrl: './gamecontainer.component.html',
  styleUrls: ['./gamecontainer.component.scss']
})
export class GamecontainerComponent implements OnInit {
  public gameData: LobbyMetadata = null;

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
    this.apiService.getLobby(gameId).subscribe(lobbyData => {
      if (lobbyData.status === 'CLOSED') {
        this.router.navigate(['/']);
        return;
      }

      console.log(lobbyData);
      this.gameData = lobbyData;
    });
  }
}
