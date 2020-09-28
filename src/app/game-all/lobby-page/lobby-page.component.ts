import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
// Services
import { ApiService } from '../../service/api.service';
import { SocketService } from '../../service/socket.service';
// Types
import { GamePlayer, LobbyPlayer } from 'src/types/Player';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/service/user.service';
import GameInfo from 'src/types/GameInfo';

@Component({
  selector: 'app-lobbypage',
  templateUrl: './lobby-page.component.html',
  styleUrls: ['./lobby-page.component.scss']
})
export class LobbyPageComponent implements OnInit, OnDestroy {
  @Input() gameInfo: GameInfo;

  private subscriptions = new Subscription();

  constructor(
    private _apiService: ApiService,
    private _socketService: SocketService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
  ) { }

  ngOnInit(): void {
    this.onInitLobbyId(this.gameInfo.code);
  }

  ngOnDestroy(): void {
    this.dropSocketConnections();

    if (this.gameInfo.status === 'LOBBY') {
      console.log(this.gameInfo);
      console.log("Yes");
      this.leaveLobby();
    }
  }

  createSocketSubscriptions(lobbyId: string) {
    console.log('[LobbyComponent] Initializing Lobby');
    // Player Join
    this.subscriptions.add(
      this._socketService.onGamePlayerJoin(lobbyId).subscribe(this.onPlayerJoin.bind(this))
    );

    // Player Leave
    this.subscriptions.add(
      this._socketService.onGamePlayerLeave(lobbyId).subscribe(this.onPlayerLeave.bind(this))
    );

    // TODO
    // Player Ready
    this.subscriptions.add(
      this._socketService.onGamePlayerReady(lobbyId).subscribe(this.onPlayerReady.bind(this))
    );

    // Player Unready
    this.subscriptions.add(
      this._socketService.onGamePlayerUnready(lobbyId).subscribe(this.onPlayerUnready.bind(this))
    );

    // Lobby closed
    this.subscriptions.add(
      this._socketService.onGameClose(lobbyId).subscribe(this.onLobbyClosed.bind(this))
    );
  }

  dropSocketConnections() {
    this.subscriptions.unsubscribe();
  }

  onInitLobbyId(lobbyId: string) {
    this._socketService.socketStatus.subscribe(status => {
      switch (status) {
        case 'DISCONNECT':
          this.dropSocketConnections();
          break;
        case 'CONNECT':
          this.createSocketSubscriptions(lobbyId);
          break;
      }
    })
  }

  /**
   * Scan the members of the lobby, looking for the local player.
   * @returns Player information of the localPlayer, or null if not found.
   */
  getLocalPlayer() {
    const player = this.gameInfo.lobbyPlayers.find(
      p => p.userId === this._userService.id
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
    return (player === null) ? false : player.isReady;
  }

  /**
   * Triggered when a player readies up
   * @param playerInfo Information of the ready player
   */
  onPlayerReady(playerId: string) {
    const idx = this.gameInfo.lobbyPlayers.findIndex(player => player.userId === playerId);
    this.gameInfo.lobbyPlayers[idx].isReady = true;
  }

  /**
   * Triggered when a player unreadies
   * @param playerInfo Information of the unready player
   */
  onPlayerUnready(playerId: string) {
    const idx = this.gameInfo.lobbyPlayers.findIndex(player => player.userId === playerId);
    this.gameInfo.lobbyPlayers[idx].isReady = false;
  }

  /**
   * Triggered when a player joins the game
   * @param playerInfo Information of the joining player
   */
  onPlayerJoin(playerInfo: LobbyPlayer) {
    console.log(playerInfo);
    this.gameInfo.lobbyPlayers = this.gameInfo.lobbyPlayers.filter(p => p.userId !== playerInfo.userId);

    this.gameInfo.lobbyPlayers.push(playerInfo);
    this.isLocalPlayerJoined();
  }

  /**
   * Triggered when a player leaves the game
   * @param playerInfo Information of leaving player
   */
  onPlayerLeave(playerId: string) {
    this.gameInfo.lobbyPlayers = this.gameInfo.lobbyPlayers.filter(p => p.userId !== playerId);
    this.isLocalPlayerJoined();
  }

  /**
   * Triggered when (hopefully) this lobby closed
   */
  onLobbyClosed() {
    console.log(`Lobby closed`);
    this._router.navigate(['/']);
  }

  onLobbyLaunch(gameId: string) {
    console.log(`[LobbyComponent] Lobby Launched into :${gameId}`);
    this._router.navigate(['/game', gameId]);
  }

  /**
   * Check if the localPlayer is the lobby onwer
   */
  localPlayerIsOwner(): boolean {
    return this._userService.id === this.gameInfo.ownerId;
  }

  /**
   * Check if the localPlayer is an admin
   */
  localPlayerIsAdmin(): boolean {
    return this._userService.role === 'admin';
  }

  /**
   * Attempt to join the lobby
   */
  joinLobby() {
    this._apiService.joinLobby(this.gameInfo.code).subscribe();
  }

  /**
   * Attempt to leave the lobby
   */
  leaveLobby() {
    this._apiService.leaveLobby(this.gameInfo.code).subscribe();
  }

  /**
   * Attempt to set ready status to 'ready'
   */
  setReady() {
    this._apiService.setLobbyPlayerReady(this.gameInfo.code).subscribe();
  }

  /**
   * Attempt to set ready status to 'unready'
   */
  setUnready() {
    this._apiService.setLobbyPlayerUnready(this.gameInfo.code).subscribe();
  }

  /**
   * As the lobby owner, attempt to start the lobby.
   */
  ownerLaunchGame() {
    this._apiService.launchGame(this.gameInfo.code).subscribe();
  }

  /**
   * As an admin, attempt to close the lobby.
   */
  adminCloseLobby() {
    this._apiService.closeLobby(this.gameInfo.code).subscribe();
  }
}
