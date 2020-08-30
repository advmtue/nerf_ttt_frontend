import { Component, OnInit, OnDestroy } from '@angular/core';
import { TokenService } from '../service/token.service';
import { ApiService } from '../service/api.service';
import { FormBuilder, Validators, AbstractControl, FormGroup } from '@angular/forms';
import LobbyMetadata from 'src/types/LobbyMetadata';
import { SocketService } from '../service/socket.service';
import { Observable, Subscription } from 'rxjs';
import { IMessage } from '@stomp/stompjs';
import LobbyPlayerChange from 'src/types/LobbyPlayerChange';

@Component({
  selector: 'app-lobbylist-page',
  templateUrl: './lobbylist-page.component.html',
  styleUrls: ['./lobbylist-page.component.scss']
})
export class LobbylistPageComponent implements OnInit, OnDestroy {

  createLobbyForm: FormGroup;
  showCreateFormInvalid = false;
  lobbyList: {[key: string]: LobbyMetadata} = {};

  onNewLobby: Subscription;
  onClosedLobby: Subscription;
  onLobbyUpdated: Subscription;

  constructor(
    private tokenService: TokenService,
    private apiService: ApiService,
    private formbuilder: FormBuilder,
    private socketService: SocketService
  ) {
    // Create form controls
    this.createLobbyForm = formbuilder.group({
      'name': ['', Validators.required]
    })
  }

  ngOnInit() {
    // Pull the lobby list
    this.getLobbyList();

    // Subscribe to lobby updates
    this.onNewLobby = this.socketService.watchNewLobbies().subscribe(this.getNewLobby.bind(this));
    this.onClosedLobby = this.socketService.watchClosedLobbies().subscribe(this.getClosedLobby.bind(this));
    this.onLobbyUpdated = this.socketService.watchUpdatedLobbies().subscribe(this.getUpdatedPlayerCount.bind(this));
  }

  ngOnDestroy() {
    this.onNewLobby.unsubscribe();
    this.onClosedLobby.unsubscribe();
    this.onLobbyUpdated.unsubscribe();
  }

  /**
   * Recieve a new lobby through the observable
   * @param message Lobby information
   */
  getNewLobby(lobbyInfo: LobbyMetadata) {
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
    if (this.lobbyList[lobbyInfo.lobbyId] === undefined) return;


    this.lobbyList[lobbyInfo.lobbyId].playerCount = lobbyInfo.playerCount;
  }

  getLobbyList(): void {
    this.apiService.getLobbies()
      .subscribe((lobbies: LobbyMetadata[]) => {
        lobbies.forEach((lobby: LobbyMetadata) => {
          this.lobbyList[lobby.gameId] = lobby;
        })
      })
  }

  userIsAdmin() {
    return this.tokenService.userIsAdmin();
  }

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
    this.apiService.postCreateLobby(this.createLobbyForm.value).subscribe();

    // Reset form controls
    this.createLobbyForm.reset();
  }

  adminCloseLobby(lobbyId: string) {
    this.apiService.postCloseLobby(lobbyId).subscribe();
  }

  isEmpty(lobbyList: {[key: string]: LobbyMetadata}) {
    return Object.keys(lobbyList).length === 0;
  }
}
