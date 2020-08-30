import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
// Services
import { ApiService } from '../../service/api.service';
import { SocketService } from '../../service/socket.service';
import { TokenService } from '../../service/token.service';
// Types
import LobbyMetadata from 'src/types/LobbyMetadata';
import LobbyPlayer from 'src/types/LobbyPlayer';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-lobbypage',
  templateUrl: './lobby-page.component.html',
  styleUrls: ['./lobby-page.component.scss']
})
export class LobbyPageComponent implements OnInit, OnDestroy {
  @Input() lobbyMetadata: LobbyMetadata = undefined;
  lobbyPlayers: LobbyPlayer[] = [];

  private playerJoinSub: Subscription;
  private playerLeaveSub: Subscription;
  private playerReadySub: Subscription;
  private playerUnreadySub: Subscription;
  private lobbyClosedSub: Subscription;

  constructor(
    private apiService: ApiService,
    private socketService: SocketService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const lobbyId = this.lobbyMetadata.gameId;

    // Player Join
    this.playerJoinSub = this.socketService
      .watchPath<LobbyPlayer>(`/topic/lobby/${lobbyId}/playerjoin`)
      .subscribe(this.onPlayerJoin.bind(this));

    // Player Leave
    this.playerLeaveSub = this.socketService
      .watchPath<LobbyPlayer>(`/topic/lobby/${lobbyId}/playerleave`)
      .subscribe(this.onPlayerLeave.bind(this));

    // Player Ready
    this.playerReadySub = this.socketService
      .watchPath<LobbyPlayer>(`/topic/lobby/${lobbyId}/playerunready`)
      .subscribe(this.onPlayerUnready.bind(this));

    // Player Unready
    this.playerUnreadySub = this.socketService
      .watchPath<LobbyPlayer>(`/topic/lobby/${lobbyId}/playerready`)
      .subscribe(this.onPlayerReady.bind(this));

    // Lobby closed
    this.lobbyClosedSub = this.socketService
      .watchPath<{lobbyId: string}>(`/topic/lobby/${lobbyId}/closed`)
      .subscribe(this.onLobbyClosed.bind(this));

    // Pull lobby players
    this.apiService.getLobbyPlayers(lobbyId).subscribe((p) => {
      this.lobbyPlayers = p;

      this.isLocalPlayerJoined();
      this.isLocalPlayerReady();
    });
  }

  ngOnDestroy(): void {
    this.playerReadySub.unsubscribe();
    this.playerUnreadySub.unsubscribe();
    this.playerJoinSub.unsubscribe();
    this.playerLeaveSub.unsubscribe();
    this.lobbyClosedSub.unsubscribe();
  }

  /**
   * Scan the members of the lobby, looking for the local player.
   * @returns Player information of the localPlayer, or null if not found.
   */
  getLocalPlayer() {
    const player = this.lobbyPlayers.find(
      p => p.playerId === this.tokenService.getUserId()
    )
    
    return player === undefined ? null : player;
  }

  /**
   * Determine if the localPlayer has joined the lobby
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
    this.isLocalPlayerJoined()
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
    console.log('Lobby closed');
    console.log(lobbyId);
    console.log(this.lobbyMetadata.gameId);
    this.router.navigate(['/']);
  }

  /**
   * Check if the localPlayer is the lobby onwer
   */
  localPlayerIsOwner(): boolean {
    return this.tokenService.getUserId() === this.lobbyMetadata.ownerId;
  }

  /**
   * Check if the localPlayer is an admin
   */
  localPlayerIsAdmin(): boolean {
    return this.tokenService.userIsAdmin();
  }

  /**
   * Attempt to join the lobby
   */
  joinLobby() {
    this.apiService.joinLobby(this.lobbyMetadata.gameId).subscribe();
  }

  /**
   * Attempt to leave the lobby
   */
  leaveLobby() {
    this.apiService.leaveLobby(this.lobbyMetadata.gameId).subscribe();
  }

  /**
   * Attempt to set ready status to 'ready'
   */
  setReady() {
    this.apiService.setLobbyPlayerReady(this.lobbyMetadata.gameId).subscribe();
  }

  /**
   * Attempt to set ready status to 'unready'
   */
  setUnready() {
    this.apiService.setLobbyPlayerUnready(this.lobbyMetadata.gameId).subscribe()
  }

  /**
   * As the lobby owner, attempt to start the lobby.
   */
  ownerStartLobby() {}

  /**
   * As an admin, attempt to close the lobby.
   */
  adminCloseLobby() {
    this.apiService.postCloseLobby(this.lobbyMetadata.gameId).subscribe(console.log);
  }
}