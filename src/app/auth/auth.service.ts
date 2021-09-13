import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public readonly authBaseUrl = 'http://localhost:8080/auth/realms/EO4A/protocol/openid-connect/token';
  private readonly clientId = 'eo4a-angular';
  public redirectUrl: string = null;      // redirect url after auth

  private _isUserAuthenticated = false;

  get isUserAuthenticated(): boolean {
    return this._isUserAuthenticated;
  }

  constructor(
    private http: HttpClient
  ) { }


  requestAccessToken(username: string, password: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    const urlencoded = new URLSearchParams();
    urlencoded.set('grant_type', 'password');
    urlencoded.set('username', username);
    urlencoded.set('password', password);
    urlencoded.set('client_id', this.clientId);

    return this.http.post(
      this.authBaseUrl,
      urlencoded.toString(),
      { headers: headers }
    ).pipe(
      map(res => {
        console.log(res);
        if (res.hasOwnProperty('access_token')) {
          const accessToken = res['access_token'];
          console.log('Saving access_token to local storage');
          localStorage.setItem('access_token', accessToken);

          this._isUserAuthenticated = true;
        } else {
          console.warn('Access token not found in response');
          this._isUserAuthenticated = false;
        }
        return this.isUserAuthenticated;
      }),
      catchError(() => {
        console.warn('User authentication failed');
        return of(false);
      })
    );
  }
}
