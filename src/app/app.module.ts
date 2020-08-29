import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

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
import { GamepageComponent } from './gamepage/gamepage.component';

@NgModule({
	declarations: [
		AppComponent,
		NavbarComponent,
		LoginPageComponent,
		PasswordresetPageComponent,
		LobbylistPageComponent,
		LogoutPageComponent,
		GamepageComponent
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
		{ provide: 'API_URL', useValue: 'http://localhost:8080' },
		{ provide: 'WEBSOCKET_URL', useValue: 'ws://localhost:8080/socket' },
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
