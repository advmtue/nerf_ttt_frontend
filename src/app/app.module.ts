import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ApiService } from './service/api.service';
import { TokenService } from './service/token.service';
import { LogoutPageComponent } from './logout-page/logout-page.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';

// Game states
import { LobbyPageComponent } from './game-all/lobby-page/lobby-page.component';
import { IngamePageComponent } from './game-all/ingame-page/ingame-page.component';
import { PregamePageComponent } from './game-all/pregame-page/pregame-page.component';
import { PostgamePageComponent } from './game-all/postgame-page/postgame-page.component';
import { GamecontainerComponent } from './game-all/gamecontainer/gamecontainer.component';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { JoinLobbyPageComponent } from './join-lobby-page/join-lobby-page.component';
import { GameStatusViewComponent } from './game-status-view/game-status-view.component';
import { GameFullViewComponent } from './game-full-view/game-full-view.component';
import { GameDeathSelectorComponent } from './game-death-selector/game-death-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginPageComponent,
    LogoutPageComponent,
    LobbyPageComponent,
    IngamePageComponent,
    PregamePageComponent,
    PostgamePageComponent,
    GamecontainerComponent,
    AuthPageComponent,
    RegistrationPageComponent,
    LandingPageComponent,
    JoinLobbyPageComponent,
    GameStatusViewComponent,
    GameFullViewComponent,
    GameDeathSelectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    ApiService,
    TokenService,
    { provide: 'API_URL', useValue: environment.apiUrl },
    { provide: 'WEBSOCKET_URL', useValue: environment.websocketUrl },
    { provide: 'DISCORD_OAUTH_URL', useValue: environment.discordOAuthUrl },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
