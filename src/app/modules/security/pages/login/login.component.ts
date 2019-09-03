import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../../core/services';
import {FormBuilder, Validators} from '@angular/forms';
import {Profile} from '../../../../shared/models/role.enum';
import {AppConfig} from '../../../../configs/app.config';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {UserIdleConfig, UserIdleService} from 'angular-user-idle';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {MODAL_SIZE} from '../../../../shared/helpers';
import {MatDialog} from '@angular/material';
import {TimeDialogComponent} from '../../../../shared/components/time-dialog/time-dialog.component';
import {Subscription} from 'rxjs';
import {TimerObservable} from 'rxjs-compat/observable/TimerObservable';


@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    role: ['']
  });
  loading: boolean;
  invalidSession = false;
  error;
  config: UserIdleConfig;
  dialogRef;
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private userIdle: UserIdleService,
    public dialog: MatDialog) {
    super();
  }

  get isAuthenticatedUser(): boolean {
    return !!localStorage.getItem(AppConfig.sessionLocalStorageKey);
  }

  ngOnInit() {
    localStorage.setItem('inLogin', 'inLogin');

    document.addEventListener('click', () => {
      if (this.userIdle !== null) {
        this.userIdle.resetTimer();
      }

      if (localStorage.getItem('logout') === 'logout') {
        if (!!this.userIdle) {
          this.userIdle.stopWatching();
        }
        this.userIdle = null;
        localStorage.setItem('logout', null);
        return;
      }
    });

    let timer = TimerObservable.create(0, 1000);
    this.subscription = timer.subscribe(t => {
      if (localStorage.getItem('inLogin') == 'inLogin') {
        if (!!this.userIdle) {
          this.userIdle.stopWatching();
          this.userIdle = null;
        }
        this.userIdle = null;
      }
    });

    this.userIdle = new UserIdleService({idle: 1, timeout: AppConfig.sessionTime, ping: 99999999999999999});
    this.userIdle.stopTimer();
    this.userIdle.stopWatching();
    if (localStorage.getItem('invalidSession') == 'true') {
      this.closeAllDialogs();
      localStorage.setItem('invalidSession', null);
      Promise.resolve().then(() => {
        this.closeAllDialogs();
        const dialogRefClose = this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: 'errors.invalidSession', invalidSession: 'true'}
        });
        dialogRefClose.afterClosed().subscribe(() => {
          localStorage.setItem('invalidSession', null);
          this.closeAllDialogs();
        });
      });
    } else {
      localStorage.setItem('invalidSession', null);
    }
  }

  closeAllDialogs() {
    const sweetAlertBackground = document.querySelectorAll('.cdk-overlay-pane');
    const elements = document.getElementsByClassName('.cdk-overlay-pane');
    this.dialog.closeAll();
    if (sweetAlertBackground) {
      // sweetAlertBackground.click(); // only if background close the dialog
    }
  }

  onSubmit(form) {
    this.loading = true;
    this.invalidSession = false;
    this.authenticationService.login(form.username, form.password)
      .subscribe(
        loginResponse => {
          if (!!loginResponse && loginResponse.errorCode === 0 && !!loginResponse.sessionID) {
            this.authenticationService.getRoles(form.username, loginResponse.sessionID).subscribe((rolesResponse) => {
              localStorage.setItem('inLogin', 'not');
              if (rolesResponse.errorCode === '0' && !!rolesResponse.data && !!rolesResponse.data[0] && !!rolesResponse.data[0][0]) {
                if (!this.userIdle) {
                  this.userIdle = new UserIdleService({idle: 1, timeout: AppConfig.sessionTime, ping: 99999999999999999});
                }
                this.userIdle.startWatching();
                let role = rolesResponse.data[0][0].roleId;
                let roles = '';
                (<any[]>rolesResponse.data[0]).forEach((r) => {
                  if (roles === '') {
                    roles += r.roleId;
                  } else {
                    roles += ',' + r.roleId;
                  }
                });
                localStorage.setItem(AppConfig.sessionLocalStorageKey, JSON.stringify({
                  sessionID: loginResponse.sessionID,
                  userID: loginResponse.sessionID,
                  expirationDate: loginResponse.expirationDate,
                  lastLoginDate: loginResponse.lastLoginDate,
                  forceChangePassword: loginResponse.forceChangePassword,
                  forceRecoveryMode: loginResponse.forceRecoveryMode,
                  username: (<string>form.username).toUpperCase(),
                  role: roles
                }));

                this.userIdle.onTimerStart().subscribe(count => {
                  let time = AppConfig.sessionTime - AppConfig.timeBeforeClose;
                  if (count == time - 1) {
                    const dialogRef = this.dialog.open(TimeDialogComponent, {
                      width: MODAL_SIZE.width,
                      height: MODAL_SIZE.height,
                      disableClose: true,
                      data: {date: AppConfig.timeBeforeClose}
                    });
                    dialogRef.afterClosed().subscribe(result => {
                      if (result === 'Y') {
                        this.userIdle.resetTimer();
                        return;
                      } else {
                        this.stopIdle();
                        this.router.navigateByUrl('/' + AppConfig.routes.security.root + '/' + AppConfig.routes.security.login).then(() => {
                          this.loading = false;
                        });
                        this.authenticationService.logout();
                        localStorage.setItem('invalidSession', 'true');
                      }
                    });
                  }
                  if (localStorage.getItem('inProcess') === 'inProcess') {
                    this.userIdle.resetTimer();
                  }
                });
                // Start watch when time is up.
                this.userIdle.onTimeout().subscribe(() => {
                  this.userIdle.stopWatching();
                  this.authenticationService.logout();
                  localStorage.setItem('invalidSession', 'true');
                  this.loading = true;
                  this.router.navigateByUrl('/' + AppConfig.routes.security.root + '/' + AppConfig.routes.security.login).then(() => {
                    this.loading = false;
                  });
                });

                // get main url by user
                this.authenticationService.getHomeUrl(form.username).subscribe(urlResponse => {
                  if (urlResponse.errorCode === '0') {
                    if (!!urlResponse.data) {
                      this.router.navigateByUrl('/' + urlResponse.data).then(() => {
                        this.loading = false;
                      });
                    }
                  } else {
                    const dialogRefError = this.dialog.open(ErrorDialog, {
                      width: MODAL_SIZE.width,
                      height: MODAL_SIZE.height,
                      disableClose: true,
                      data: {error: 'errors.unexpected'}
                    });
                  }

                });
              } else {
                this.error = 'security.login.noPermissions';
              }
            });
          } else if (!!loginResponse && loginResponse.errorCode === -9404) {
            this.error = 'security.login.blocked';
          } else {
            this.error = 'security.login.unauthorized';
          }
          this.loading = false;
        },
        error => {
          this.error = 'errors.' + error.error.status;
          this.loading = false;
        });
  }

  stopIdle() {
    if (!!this.userIdle) {
      this.userIdle.stopWatching();
      this.userIdle = null;
    }
    this.userIdle = null;
  }
}
