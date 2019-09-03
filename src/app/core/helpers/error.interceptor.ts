import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {AuthenticationService} from '../services';
import {AppConfig} from '../../configs/app.config';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401 && this.isAuthenticatedUser) {
        // auto logout if 401 response returned from api
        this.authenticationService.logout();
        location.reload(true);
      }
      return throwError(err);
    }));
  }

  get isAuthenticatedUser(): boolean {
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    return !!sessionData && !!sessionData.role;
  }
}
