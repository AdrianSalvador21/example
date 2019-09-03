import {Component, OnInit} from '@angular/core';
import {MenuListItemComponent, NavItem} from '../menu-list-item';
import {Profile} from '../../models/role.enum';
import {AppConfig} from '../../../configs/app.config';
import {BaseComponent} from '../base/base.component';
import {AuthenticationService} from '../../../core/services';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'two-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends BaseComponent implements OnInit {

  showCompleteMenu: Boolean;
  role: Profile;
  navItems: NavItem[] = [];
  constructor(public authenticationService: AuthenticationService, public translateService: TranslateService) {
    super();
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    authenticationService.getMenuByUser(sessionData.username).subscribe(menuResponse => {
      if (menuResponse.errorCode === '0') {
        if (menuResponse.data[0].length !== 0) {
          menuResponse.data[0].forEach(menuOption => {
            menuOption.children = [];
            menuOption.TEXT = this.translateService.instant(menuOption.TEXT);
          });
          const mainMenu = menuResponse.data[0].filter(menuItem => menuItem.ENABLED === '1');
          this.navItems = this.getMenu(mainMenu);
        }
      }
    });
  }

  ngOnInit() {
    this.filterMenuOptions();
  }

  onClickOutside(element) {
    if (!(!!element && !!element.className && element.className.animVal === 'svg-inline--fa fa-bars fa-w-14')) {
      if (!(!!element && !!element.nearestViewportElement && !!element.nearestViewportElement.className &&
        element.nearestViewportElement.className.animVal === 'svg-inline--fa fa-bars fa-w-14')) {
        if (element.id !== 'menu-bars' && element.id !== 'menu-bars-icon') {
          this.showCompleteMenu = false;
          MenuListItemComponent.expandedItem = undefined;
        }
      }
    }
  }

  private filterMenuOptions() {
    // Menu items filtered
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    let roles = (<string>sessionData.role).split(',');
    this.navItems = this.navItems.filter((item) => {
      return item.roles.some((r) => roles.indexOf(<string>r.valueOf()) > -1);
    });

    this.navItems.forEach((node) => {
      if (!!node.children) {
        node.children = node.children.filter((item) => {
          return item.roles.some((r) => roles.indexOf(<string>r.valueOf()) > -1);
        });
      }
    });
  }

  getMenu(data: NavItem[]): any[] {
    const parents = data.filter(item => item.PARENTID === '-1');
    parents.forEach(parent => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].PARENTID === parent.NODEID) {
          parent.children.push(data[i]);
        }
      }
    });
    return parents;
  }
}
