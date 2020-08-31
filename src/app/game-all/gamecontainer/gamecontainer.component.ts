import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import GameMetadata from 'src/types/GameMetadata';
import { SocketService } from 'src/app/service/socket.service';
import { Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-gamecontainer',
  templateUrl: './gamecontainer.component.html',
  styleUrls: ['./gamecontainer.component.scss']
})
export class GamecontainerComponent implements OnInit, OnDestroy {
  public gameData: GameMetadata = null;

  public subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const gameId = params.gameid;
      console.log(`Found gameId = ${gameId}`);

      // Add subscription for game status changes
      this.subscriptions.add(
        this.socketService.watchPath<{status: string}>(`/topic/lobby/${gameId}/status`)
          .pipe(pluck<{status: string}, string>('status'))
          .subscribe(this.onGameChangeStatus.bind(this))
      );

      this.initializeGamestate(gameId);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private onGameChangeStatus(newStatus: string) {
    this.gameData.status = newStatus;
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
