import { Component, OnInit } from '@angular/core';
import { TokenService } from '../service/token.service';
import { ApiService } from '../service/api.service';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import LobbyMetadata from 'src/types/LobbyMetadata';

@Component({
  selector: 'app-lobbylist-page',
  templateUrl: './lobbylist-page.component.html',
  styleUrls: ['./lobbylist-page.component.scss']
})
export class LobbylistPageComponent {

  private createLobbyForm: AbstractControl;
  private showCreateFormInvalid = false;
  
  public lobbyList: LobbyMetadata[] = [];

  constructor(
    private tokenService: TokenService,
    private apiService: ApiService,
    private formbuilder: FormBuilder
  ) {
    // Create form controls
    this.createLobbyForm = formbuilder.group({
      'name': ['', Validators.required]
    })
  }

  userIsAdmin() {
    return this.tokenService.userIsAdmin();
  }

  submitCreateLobby() {
    // If the form is invalid, show the errors
    // The only error should be 'required' field
    if (!this.createLobbyForm.valid) {
      console.log('Form is invalid');
      this.showCreateFormInvalid = true;
      return;
    }

    // Hide form validation errors
    this.showCreateFormInvalid = false;

    // Make the API call
    this.apiService.postCreateLobby(this.createLobbyForm.value)
    .subscribe(lobby => {
      console.log(lobby);
      this.lobbyList.push(lobby);
    });

    // Reset form controls
    this.createLobbyForm.reset();
  }
}
