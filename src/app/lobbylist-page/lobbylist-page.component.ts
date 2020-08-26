import { Component, OnInit } from '@angular/core';
import { TokenService } from '../service/token.service';
import { ApiService } from '../service/api.service';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-lobbylist-page',
  templateUrl: './lobbylist-page.component.html',
  styleUrls: ['./lobbylist-page.component.scss']
})
export class LobbylistPageComponent implements OnInit {

  private createLobbyForm: AbstractControl;
  private showCreateFormInvalid = false;

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

  ngOnInit(): void {
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

    this.showCreateFormInvalid = false;
    this.apiService.postCreateLobby(this.createLobbyForm.value)
    .subscribe(console.log);
  }
}
