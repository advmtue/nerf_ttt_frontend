import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(
    private _apiService: ApiService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
  }

  createLobby() {
    this._apiService.createLobby().subscribe(lobbyMetadata => {
      this._router.navigate(['/lobby', lobbyMetadata.code]);
    })
  }
}
