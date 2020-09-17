import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ApiError from 'src/types/ApiError';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-create-lobby-page',
  templateUrl: './create-lobby-page.component.html',
  styleUrls: ['./create-lobby-page.component.scss']
})
export class CreateLobbyPageComponent {
  public errorMsg = '';
  public lobbyNameControl = new FormControl('', Validators.required);

  constructor(private apiService: ApiService, private router: Router) { }

  createLobby() {
    this.errorMsg = '';

    if (!this.lobbyNameControl.valid) {
      this.errorMsg = 'Lobby name is required';
      return;
    }

    this.apiService.createLobby({ name: this.lobbyNameControl.value }).subscribe(response => {
      this.router.navigate(['/lobby', response.code]);
    })
  }
}
