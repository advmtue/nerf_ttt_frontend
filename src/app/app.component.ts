import { Component } from '@angular/core';
import { TokenService } from './service/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Nerf TTT';

  // Instantiate a token service
  constructor(private tokenService: TokenService) {}
}
