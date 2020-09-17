import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
// Services
import { ApiService } from '../service/api.service';
import { SocketService } from '../service/socket.service';
import { TokenService } from '../service/token.service';
// Types
import GameMetadata from 'src/types/GameMetadata';
import LobbyPlayer from 'src/types/LobbyPlayer';
import { Observable, Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { UserService } from 'src/app/service/user.service';
import LobbyMetadata from 'src/types/LobbyMetadata';

@Component({
  selector: 'app-lobbypage',
  templateUrl: './lobby-page.component.html',
  styleUrls: ['./lobby-page.component.scss']
})
export class LobbyPageComponent implements OnInit, OnDestroy {
  lobbyMetadata: LobbyMetadata = undefined;
  lobbyPlayers: LobbyPlayer[] = [];

  private subscriptions = new Subscription();

  constructor(
    private apiService: ApiService,
    private socketService: SocketService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (!params.lobbyId) {
        console.log('[LobbyComponent] Could not find lobbyId from route');
        return;
      }

      this.onInitLobbyId(params.lobbyId);
    })
  }

  onInitLobbyId(lobbyId: string) {
    // Player Join
    this.subscriptions.add(
      this.socketService.watchPath<LobbyPlayer>(`/topic/lobby/${lobbyId}/playerjoin`)
        .subscribe(this.onPlayerJoin.bind(this)));

    // Player Leave
    this.subscriptions.add(
      this.socketService.watchPath<LobbyPlayer>(`/topic/lobby/${lobbyId}/playerleave`)
        .subscribe(this.onPlayerLeave.bind(this)));

    // Player Ready
    this.subscriptions.add(
      this.socketService.watchPath<LobbyPlayer>(`/topic/lobby/${lobbyId}/playerunready`)
        .subscribe(this.onPlayerUnready.bind(this)));

    // Player Unready
    this.subscriptions.add(
      this.socketService.watchPath<LobbyPlayer>(`/topic/lobby/${lobbyId}/playerready`)
        .subscribe(this.onPlayerReady.bind(this)));

    // Lobby closed
    this.subscriptions.add(
      this.socketService.watchPath<{ lobbyId: string }>(`/topic/lobby/${lobbyId}/closed`)
        .pipe(pluck('lobbyId'))
        .subscribe(this.onLobbyClosed.bind(this)));

    this.apiService.getLobbyMetadata(lobbyId).subscribe({
      next: (lobbyInfo) => this.lobbyMetadata = lobbyInfo,
      error: (error) => {
        if (error.error.code === 'ERR_LOBBY_NOT_FOUND') {
          this.router.navigate(['/landing']);
        }
      }
    });

    // Pull lobby players
    this.apiService.getLobbyPlayers(lobbyId).subscribe((p) => {
      this.lobbyPlayers = p;

      this.isLocalPlayerJoined();
      this.isLocalPlayerReady();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Scan the members of the lobby, looking for the local player.
   * @returns Player information of the localPlayer, or null if not found.
   */
  getLocalPlayer() {
    const player = this.lobbyPlayers.find(
      p => p.playerId === this.userService.id
    );

    return player === undefined ? null : player;
  }

  /**
   * Determine if the localPlayer has joined the lobby
   *
   * @returns True if the player is found in the playerlist
   */
  isLocalPlayerJoined() {
    return this.getLocalPlayer() !== null;
  }

  /**
   * Determine if the localPlayer is ready in the lobby.
   * @returns True if the player is a member of the lobby, and is ready
   */
  isLocalPlayerReady() {
    const player = this.getLocalPlayer();
    return (player === null) ? false : player.ready;
  }

  /**
   * Triggered when a player readies up
   * @param playerInfo Information of the ready player
   */
  onPlayerReady(playerInfo: LobbyPlayer) {
    const idx = this.lobbyPlayers.findIndex(player => player.playerId === playerInfo.playerId);
    this.lobbyPlayers[idx].ready = true;
  }

  /**
   * Triggered when a player unreadies
   * @param playerInfo Information of the unready player
   */
  onPlayerUnready(playerInfo: LobbyPlayer) {
    const idx = this.lobbyPlayers.findIndex(player => player.playerId === playerInfo.playerId);
    this.lobbyPlayers[idx].ready = false;
  }

  /**
   * Triggered when a player joins the game
   * @param playerInfo Information of the joining player
   */
  onPlayerJoin(playerInfo: LobbyPlayer) {
    this.lobbyPlayers = this.lobbyPlayers.filter(p => p.playerId !== playerInfo.playerId);

    this.lobbyPlayers.push(playerInfo);
    this.isLocalPlayerJoined();
  }

  /**
   * Triggered when a player leaves the game
   * @param playerInfo Information of leaving player
   */
  onPlayerLeave(playerInfo: LobbyPlayer) {
    this.lobbyPlayers = this.lobbyPlayers.filter(p => p.playerId !== playerInfo.playerId);
    this.isLocalPlayerJoined();
  }

  /**
   * Triggered when (hopefully) this lobby closed
   */
  onLobbyClosed(lobbyId: string) {
    if (lobbyId === this.lobbyMetadata.code) {
      console.log(`Lobby closed = ${lobbyId}`);
      this.router.navigate(['/']);
    }
  }

  /**
   * Check if the localPlayer is the lobby onwer
   */
  localPlayerIsOwner(): boolean {
    return this.userService.id === this.lobbyMetadata.ownerId;
  }

  /**
   * Check if the localPlayer is an admin
   */
  localPlayerIsAdmin(): boolean {
    return this.userService.role === 'admin';
  }

  /**
   * Attempt to join the lobby
   */
  joinLobby() {
    this.apiService.joinLobby(this.lobbyMetadata.code).subscribe();
  }

  /**
   * Attempt to leave the lobby
   */
  leaveLobby() {
    this.apiService.leaveLobby(this.lobbyMetadata.code).subscribe();
  }

  /**
   * Attempt to set ready status to 'ready'
   */
  setReady() {
    this.apiService.setLobbyPlayerReady(this.lobbyMetadata.code).subscribe();
  }

  /**
   * Attempt to set ready status to 'unready'
   */
  setUnready() {
    this.apiService.setLobbyPlayerUnready(this.lobbyMetadata.code).subscribe();
  }

  /**
   * As the lobby owner, attempt to start the lobby.
   */
  ownerStartLobby() {
    this.apiService.startLobby(this.lobbyMetadata.code).subscribe(console.log);
  }

  /**
   * As an admin, attempt to close the lobby.
   */
  adminCloseLobby() {
    this.apiService.closeLobby(this.lobbyMetadata.code).subscribe();
  }
}
