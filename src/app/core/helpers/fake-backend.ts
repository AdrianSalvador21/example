import {Injectable} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {delay, dematerialize, materialize, mergeMap} from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const testUser = {id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User'};

    // wrap in delayed observable to simulate server api call
    return of(null).pipe(mergeMap(() => {

      // authenticate
      if (request.url.endsWith('/login') && request.method === 'POST') {
        if (request.body.username === testUser.username && request.body.password === testUser.password) {
          // if login details are valid return 200 OK with a fake jwt token
          const body = {
            errorCode: 0,
            errorDescription: null,
            expirationDate: '',
            forceChangePassword: false,
            forceRecoveryMode: false,
            lastLoginDate: '16-10-2018 08:11:13',
            sessionID: '31c714c0-47a5-4b7d-a22e-b3fb02b5520e',
            userID: '2DF8D972CDCA4202A3E59395ED98A9FF'
          };
          return of(new HttpResponse({status: 200, body}));
        } else {
          // else return 400 bad request
          return throwError({error: {message: 'Username or password is incorrect'}});
        }
      }

      // pass through any requests not handled above
      return next.handle(request);

    }))

    // call materialize and dematerialize to ensure delay even if an error is thrown
    // (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
