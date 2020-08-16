import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPageComponent } from './login-page/login-page.component';
import {PasswordresetPageComponent} from './passwordreset-page/passwordreset-page.component';
import {LobbylistPageComponent} from './lobbylist-page/lobbylist-page.component';
import {LogoutPageComponent} from './logout-page/logout-page.component';

const routes: Routes = [
	{ path: 'login', component: LoginPageComponent },
	{ path: 'passwordreset', component: PasswordresetPageComponent },
	{ path: 'lobbies', component: LobbylistPageComponent },
	{ path: 'logout', component: LogoutPageComponent },
	{ path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
