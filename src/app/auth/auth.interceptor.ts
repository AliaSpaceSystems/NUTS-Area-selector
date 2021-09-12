import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) {}

  /**
   * Inject Authorization: Bearer <access_token> header on all requests
   * @param request incoming request
   * @param next next request
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip injection for access token request entrypoint...
    if (request.url === this.authService.authBaseUrl) { return next.handle(request); }

    // ... otherwise this is a normal request and access_token must be injected;
    const accessToken = localStorage.getItem('access_token');
    if (accessToken === null) {
      console.warn('Access token not found in localStorage! User must authenticate!');
      return next.handle(request);
    } else {
      const newRequest = request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } });
      return next.handle(newRequest);
    }
  }
}
