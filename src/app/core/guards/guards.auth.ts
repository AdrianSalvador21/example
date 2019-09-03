import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AppConfig} from '../../configs/app.config';
import {Profile} from '../../shared/models';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (state.url.indexOf('/' + AppConfig.routes.security.login) > -1) {
      localStorage.removeItem(AppConfig.sessionLocalStorageKey);
      return true;
    }

    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    if (sessionData && sessionData.sessionID && sessionData.role) {
      const allowedRoles: Profile[] = route.data.roles;
      const userRoles: string[] = (<string>sessionData.role).split(',');
      if (allowedRoles.some((role) => userRoles.indexOf(role) > -1)) {
        // logged in so return true
        return true;
      }
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/' + AppConfig.routes.security.root + '/' + AppConfig.routes.security.login],
      {queryParams: {returnUrl: state.url}});
    return false;
  }
}
