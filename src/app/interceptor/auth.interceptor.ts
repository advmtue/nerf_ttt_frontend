import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../service/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.tokenService.tokenStatus.value === 'ACCESS') {
      // Create new headers
      const modifiedHeaders = request.headers.set(
        'Authorization', `Bearer ${this.tokenService.accessToken}`
      );

      // Clone the request
      const modifiedRequest = request.clone({ headers: modifiedHeaders });

      // Handle it
      return next.handle(modifiedRequest);
    }

    // Nothing occurred
    return next.handle(request);
  }
}
