import { Component, OnInit, OnDestroy } from '@angular/core';
import { TokenService } from '../service/token.service';
import { ApiService } from '../service/api.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import GameMetadata from 'src/types/GameMetadata';
import { SocketService } from '../service/socket.service';
import { Subscription } from 'rxjs';
import LobbyPlayerChange from 'src/types/LobbyPlayerChange';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-lobbylist-page',
  templateUrl: './lobbylist-page.component.html',
  styleUrls: ['./lobbylist-page.component.scss']
})
export class LobbylistPageComponent implements OnInit, OnDestroy {

  createLobbyForm: FormGroup;
  showCreateFormInvalid = false;
  lobbyList: {[key: string]: GameMetadata} = {};

  // All socket subscriptions
  private subscriptions: Subscription = new Subscription();

  constructor(
    private tokenService: TokenService,
    private apiService: ApiService,
    private formbuilder: FormBuilder,
    private socketService: SocketService
  ) {
    // Create form controls
    this.createLobbyForm = formbuilder.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Pull the lobby list
    this.getLobbyList();

    // New lobbies
    this.subscriptions.add(
      this.socketService.watchPath<GameMetadata>('/topic/lobbies/new')
      .subscribe(this.getNewLobby.bind(this)));

    // Closed lobbies
    this.subscriptions.add(
      this.socketService.watchPath<{lobbyId: string}>('/topic/lobbies/closed')
      .pipe(pluck('lobbyId'))
      .subscribe(this.getClosedLobby.bind(this)));

    // Updated lobbies
    this.subscriptions.add(
      this.socketService.watchPath<LobbyPlayerChange>('/topic/lobbies/updated')
      .subscribe(this.getUpdatedPlayerCount.bind(this)));
  }

  /**
   * Clean up subscriptions.
   */
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Recieve a new lobby through the observable
   * @param message Lobby information
   */
  getNewLobby(lobbyInfo: GameMetadata) {
    this.lobbyList[lobbyInfo.gameId] = lobbyInfo;
  }

  /**
   * Receive the ID of a lobby that is no longer available
   * @param message Message containing lobby ID as the body
   */
  getClosedLobby(lobbyId: string) {
    delete this.lobbyList[lobbyId];
  }

  /**
   * Update some lobby fields
   * @param message Message containing gameId and playerCount fields
   */
  getUpdatedPlayerCount(lobbyInfo: LobbyPlayerChange) {
    if (this.lobbyList[lobbyInfo.lobbyId] === undefined) { return; }


    this.lobbyList[lobbyInfo.lobbyId].playerCount = lobbyInfo.playerCount;
  }

  /**
   * Get current lobby listing
   */
  getLobbyList(): void {
    this.apiService.getLobbies()
      .subscribe((lobbies: GameMetadata[]) => {
        lobbies.forEach((lobby: GameMetadata) => {
          this.lobbyList[lobby.gameId] = lobby;
        });
      });
  }

  /**
   * Local player admin check
   */
  userIsAdmin() {
    return this.tokenService.userIsAdmin();
  }

  /**
   * Attempt to create a lobby.
   */
  submitCreateLobby() {
    // If the form is invalid, show the errors
    // The only error should be 'required' field
    if (!this.createLobbyForm.valid) {
      this.showCreateFormInvalid = true;
      return;
    }

    // Hide form validation errors
    this.showCreateFormInvalid = false;

    // Make the API call
    this.apiService.createLobby(this.createLobbyForm.value).subscribe();

    // Reset form controls
    this.createLobbyForm.reset();
  }

  /**
   * Attempt to close a lobby
   * @param lobbyId Lobby ID
   */
  adminCloseLobby(lobbyId: string) {
    this.apiService.closeLobby(lobbyId).subscribe();
  }

  /**
   * Helper function for checking if an object is empty
   * @param lobbyList An object
   */
  isEmpty(lobbyList: {[key: string]: GameMetadata}) {
    return Object.keys(lobbyList).length === 0;
  }
}
