import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../core/services';
import {Router} from '@angular/router';
import {AppConfig} from '../../../configs/app.config';
import {BaseComponent} from '../base/base.component';

@Component({
  selector: 'two-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent extends BaseComponent implements OnInit {

  @Input() showText;

  constructor(private authenticationService: AuthenticationService, private router: Router) {
    super();
  }

  ngOnInit() {
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigateByUrl('/' + AppConfig.routes.security.root + '/' + AppConfig.routes.security.login);
    localStorage.setItem('logout', 'logout');
  }

}
