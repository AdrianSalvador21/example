import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppConfig} from '../../configs/app.config';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    if (sessionData && sessionData.sessionID) {
      request = request.clone({
        setHeaders: {
          sessionID: `${sessionData.sessionID}`
        }
      });
    }

    return next.handle(request);
  }
}
