import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPageComponent } from './login-page/login-page.component';
import { LogoutPageComponent } from './logout-page/logout-page.component';
import { GamecontainerComponent } from './game-all/gamecontainer/gamecontainer.component';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { AuthenticatedGuard } from './authenticated.guard';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { JoinLobbyPageComponent } from './join-lobby-page/join-lobby-page.component';
import { LobbyPageComponent } from './lobby-page/lobby-page.component';
import { CreateLobbyPageComponent } from './create-lobby-page/create-lobby-page.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'auth', component: AuthPageComponent },
  { path: 'register', component: RegistrationPageComponent },
  { path: 'logout', component: LogoutPageComponent, canActivate: [AuthenticatedGuard] },
  { path: 'lobby/:lobbyId', component: LobbyPageComponent, canActivate: [AuthenticatedGuard] },
  { path: 'game/:gameid', component: GamecontainerComponent, canActivate: [AuthenticatedGuard] },
  { path: "landing", component: LandingPageComponent, canActivate: [AuthenticatedGuard] },
  { path: "lobbysearch", component: JoinLobbyPageComponent, canActivate: [AuthenticatedGuard] },
  { path: "createlobby", component: CreateLobbyPageComponent, canActivate: [AuthenticatedGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
