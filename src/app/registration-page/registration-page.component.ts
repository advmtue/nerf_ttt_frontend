import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss']
})
export class RegistrationPageComponent implements OnInit {
  public displayNameControl = new FormControl('', Validators.required);

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.userService.authStatus.subscribe(newStatus => {
      if (newStatus === 'FULL') {
        this.router.navigate(['/']);
      }
    })
  }

  register() {
    this.displayNameControl.markAllAsTouched();

    if (!this.displayNameControl.valid) {
      console.log('[RegistrationComponent] Display name does not pass validation');
      return;
    }

    this.apiService.register(this.displayNameControl.value).subscribe((response) => {
      if (response.success) {
        this.userService.getNewAccessToken();
      }
    })
  }
}
