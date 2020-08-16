import { Component, OnInit } from '@angular/core';
import {TokenService} from '../service/token.service';
import {Router} from '@angular/router';

@Component({
	selector: 'app-logout-page',
	templateUrl: './logout-page.component.html',
	styleUrls: ['./logout-page.component.scss']
})
export class LogoutPageComponent implements OnInit {

	constructor(
		private tokenService: TokenService,
		private router: Router
	) { }

	ngOnInit(): void {
		// If the token gets updated to NONE then navigate back to login page
		this.tokenService.tokenStatus.subscribe((tokenStatus: string) => {
			if (tokenStatus === 'NONE') {
				this.router.navigate(['/login']);
			}
		});

		// Delete the token -- effectively logs out
		this.tokenService.deleteToken();
	}
}
