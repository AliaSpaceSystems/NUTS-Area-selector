import { Injectable } from '@angular/core';
import {
  CanLoad,
  Route,
  Router,
  UrlSegment,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    console.log(route);
    const isAuth = this.authService.isUserAuthenticated;
    if (!isAuth) {
      this.authService.redirectUrl = route.path;  // Save the guarded url for future redirect after auth
      this.router.navigateByUrl('/auth').then(() => console.log('User not logged in. Redirecting to /auth'));
    }
    return isAuth;  // If true, route allowed. If not, route is blocked -> redirect the user
  }
}
