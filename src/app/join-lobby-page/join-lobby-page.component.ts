import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ApiError from 'src/types/ApiError';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-join-lobby-page',
  templateUrl: './join-lobby-page.component.html',
  styleUrls: ['./join-lobby-page.component.scss']
})
export class JoinLobbyPageComponent implements OnInit {
  public errorMsg = '';
  public lobbyCodeControl = new FormControl('', Validators.required);

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
  }

  joinLobby() {
    this.errorMsg = '';

    if (!this.lobbyCodeControl.valid) {
      this.errorMsg = 'Lobby code is required';
      return;
    }

    let lobbyCode: string = this.lobbyCodeControl.value;
    lobbyCode = lobbyCode.toUpperCase();

    this.apiService.getLobbyMetadata(lobbyCode).subscribe({
      next: (lobbyInfo) => this.router.navigate(["/lobby", lobbyInfo.code]),
      error: (err) => this.onJoinLobbyError(err.error)
    });
  }

  onJoinLobbyError(error: ApiError) {
    if (error.code === 'ERR_LOBBY_NOT_FOUND') {
      this.errorMsg = 'Lobby not found';
    }
  }
}
