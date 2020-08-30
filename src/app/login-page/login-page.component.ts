import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import {TokenService} from '../service/token.service';

@Component({
	selector: 'app-login-page',
	templateUrl: './login-page.component.html',
	styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

	loginForm: FormGroup;
	showAllValidations: boolean = false;
	showError: boolean = false;

	constructor(
		formBuilder: FormBuilder,
		private apiService: ApiService,
		private router: Router,
		private tokenService: TokenService,
	) {
		this.loginForm = formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required]
		});
	}

	ngOnInit(): void {
		this.tokenService.tokenStatus.subscribe((tokenStatus: string) => {
			if (tokenStatus === 'ACQUIRED') {
				this.router.navigate(['/lobbies']);
			}
		});
	}

	onSubmit() {
		if (!this.loginForm.valid) {
			this.showAllValidations = true;
			return;
		}

		this.showError = false;

		// Make an API call
		this.apiService.login(this.loginForm.value)
			.subscribe({
				next: (tokenData) => {
					if (tokenData.resetPassword) {
						this.router.navigate(['/passwordreset']);
					} else if (tokenData.token) {
						this.tokenService.token = tokenData.token;
					}
				},
				error: (error) => {
					if (error.error.code) {
						if (error.error.code === 'ERR_INVALID_CREDENTIALS') {
							this.showError = true;
						}
					}
				},
			});
	}

	shouldShowValidation(controlName: string): boolean {
		return !this.loginForm.controls[controlName].valid && this.showAllValidations;
	}
}
