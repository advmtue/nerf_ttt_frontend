import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { SocketService } from '../service/socket.service';
import LobbyMetadata from 'src/types/LobbyMetadata';
import LobbyPlayer from 'src/types/LobbyPlayer';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TokenService } from '../service/token.service';

@Component({
  selector: 'app-gamepage',
  templateUrl: './gamepage.component.html',
  styleUrls: ['./gamepage.component.scss']
})
export class GamepageComponent implements OnInit {
  lobbyMetadata: LobbyMetadata = undefined;
  lobbyPlayers: LobbyPlayer[] = [];

  constructor(
    private apiService: ApiService,
    private socketService: SocketService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.initializeGamestate(params['gameid']);
    });
  }

  /**
   * Initialize the gamestate, pulling lobby metadata
   * @param lobbyId 
   */
  initializeGamestate(lobbyId: string) {
    this.apiService.getLobby(lobbyId).subscribe((l) => {
      this.lobbyMetadata = l;

      // If game state === LOBBY, pull players
      if (this.lobbyMetadata.status === 'LOBBY') {

        // Player Join
        this.socketService.watchLobbyPlayerJoin(lobbyId)
          .subscribe(this.onPlayerJoin.bind(this));

        // Player Leave
        this.socketService.watchLobbyPlayerLeave(lobbyId)
          .subscribe(this.onPlayerLeave.bind(this));

        // Player Ready
        this.socketService.watchLobbyPlayerUnready(lobbyId)
          .subscribe(this.onPlayerUnready.bind(this));
        
        // Player Unready
        this.socketService.watchLobbyPlayerReady(lobbyId)
          .subscribe(this.onPlayerReady.bind(this));

        this.socketService.watchLobbyClose(lobbyId)
          .subscribe(this.onLobbyClosed.bind(this));

        // Pull lobby players
        this.apiService.getLobbyPlayers(lobbyId).subscribe((p) => {
          this.lobbyPlayers = p;

          this.isLocalPlayerJoined();
          this.isLocalPlayerReady();
        });
      }
    });
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
