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
import { PasswordresetPageComponent } from './passwordreset-page/passwordreset-page.component';
import { TokenService } from './service/token.service';
import { LobbylistPageComponent } from './lobbylist-page/lobbylist-page.component';
import { LogoutPageComponent } from './logout-page/logout-page.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';

// Game states
import { LobbyPageComponent } from './game-all/lobby-page/lobby-page.component';
import { IngamePageComponent } from './game-all/ingame-page/ingame-page.component';
import { PregamePageComponent } from './game-all/pregame-page/pregame-page.component';
import { PostgamePageComponent } from './game-all/postgame-page/postgame-page.component';
import { GamecontainerComponent } from './game-all/gamecontainer/gamecontainer.component';
import { LaunchingPageComponent } from './game-all/launching-page/launching-page.component';
import { GameMetadataViewComponent } from './game-metadata-view/game-metadata-view.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginPageComponent,
    PasswordresetPageComponent,
    LobbylistPageComponent,
    LogoutPageComponent,
    LobbyPageComponent,
    IngamePageComponent,
    PregamePageComponent,
    PostgamePageComponent,
    GamecontainerComponent,
    LaunchingPageComponent,
    GameMetadataViewComponent
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
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
