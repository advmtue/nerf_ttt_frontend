import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { TokenService } from '../service/token.service';

@Component({
	selector: 'app-passwordreset-page',
	templateUrl: './passwordreset-page.component.html',
	styleUrls: ['./passwordreset-page.component.scss']
})
export class PasswordresetPageComponent implements OnInit {

	resetForm: FormGroup;
	showValidations: boolean = false;
	errorMsg: string = '';

	constructor(
		formBuilder: FormBuilder,
		private tokenService: TokenService,
		private apiService: ApiService,
		private router: Router)
	{
		this.resetForm = formBuilder.group({
			'username': ['', Validators.required],
			'newPassword': ['', Validators.required],
			'defaultPassword': ['', Validators.required]
		});
	}

	ngOnInit(): void {
		this.tokenService.tokenStatus.subscribe((status: string) => {
			if (status === 'ACQUIRED') {
				this.router.navigate(['/lobbies']);
			}
		});
	}

	onSubmit(): void {
		if (!this.resetForm.valid) {
			this.showValidations = true;
			this.errorMsg = '';
			return;
		}

		// Clear errors/validations
		this.errorMsg = '';
		this.showValidations = false;

		this.apiService.changePassword(this.resetForm.value)
			.subscribe({
				  next: (data) => {
					  if (data.token) {
						  this.tokenService.token = data.token;
					  }
				  },
				  error: (error) => {
					  if (error.error) {
						  switch (error.error.code) {
							  case 'ERR_PASSWORD_NOT_CHANGEABLE': {
								  this.errorMsg = 'Password is incorrect or unchangeable.';
								  break;
							  }
							  default: {
								  console.log(error.error.code);
								  this.errorMsg = 'An unknown error occurred.';
							  }
						  }
					  }
				  }
			  });

	}

	shouldShowValidation(controlName: string): boolean {
		return this.showValidations && !this.resetForm.controls[controlName].valid;
	}
}
