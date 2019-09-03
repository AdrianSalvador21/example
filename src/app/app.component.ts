import {Component, HostListener, isDevMode, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';
import {MatIconRegistry, MatSnackBar} from '@angular/material';
import {LocalStorage} from 'ngx-store';
import {loadSVGIcons} from './shared/helpers/utils.helper';
import {AppConfig} from './configs/app.config';
import {MenuComponent} from './shared/components/menu';
import {MenuListItemComponent} from './shared/components/menu-list-item';
import {LoggerService} from './core/services';
import {Router} from '@angular/router';
import {environment} from '../environments/environment';
import {AppConfigAccept} from './configs/app.config.accept';
import {AppConfigProd} from './configs/app.config.prod';
import {AppConfigPre} from './configs/app.config.pre';
import {AppConfigDev} from './configs/app.config.dev';

declare const require;

@Component({
  selector: 'two-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  @ViewChild('menu') menu: MenuComponent;
  @LocalStorage() language = 'es';
  isOnline: boolean;

  constructor(private translateService: TranslateService,
              private title: Title,
              private meta: Meta,
              private snackBar: MatSnackBar,
              public router: Router,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    this.isOnline = navigator.onLine;
    loadSVGIcons(iconRegistry, sanitizer);
    LoggerService.info(AppConfig.version);
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(evt: KeyboardEvent) {
    if (
      evt.keyCode === 8 || evt.which === 8
    ) {
      let doPrevent = true;
      const types = ['text', 'password', 'file', 'search', 'email', 'number', 'date', 'color', 'datetime', 'datetime-local', 'month', 'range', 'search', 'tel', 'time', 'url', 'week'];
      const target = (<HTMLInputElement>evt.target);

      const disabled = target.disabled || (<HTMLInputElement>event.target).readOnly;
      if (!disabled) {
        if (target.isContentEditable) {
          doPrevent = false;
        } else if (target.nodeName === 'INPUT') {
          let type = target.type;
          if (type) {
            type = type.toLowerCase();
          }
          if (types.indexOf(type) > -1) {
            doPrevent = false;
          }
        } else if (target.nodeName === 'TEXTAREA') {
          doPrevent = false;
        }
      }


      if (doPrevent) {
        evt.preventDefault();
        return false;
      }

    }
  }


  @HostListener('document:paste', ['$event'])
  onPaste(event) {
    setTimeout(() => {
      let val = event.target.value;
      event.target.value = '';
      event.target.value = val;
    }, 50);
  }

  get isAuthenticatedUser(): boolean {
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    return !!sessionData && !!sessionData.role;
  }

  ngOnInit() {

    this.translateService.setDefaultLang('es');
    this.translateService.use(this.language);

    // With this we load the default language in the main bundle (cache busting)
    this.translateService.setTranslation('es', require('../assets/i18n/es.json'));

    this.title.setTitle('Consola Banco Sabadell');
    //TODO uncomment this line in prod
    if (!isDevMode()) {
      localStorage.removeItem(AppConfig.sessionLocalStorageKey);
      console.dir(environment);
      switch (environment.env) {
        case 'dev':
          Object.assign(AppConfig, AppConfigDev);
          break;
        case 'accept':
          Object.assign(AppConfig, AppConfigAccept);
          break;
        case 'pre':
          Object.assign(AppConfig, AppConfigPre);
          break;
        case 'prod':
          Object.assign(AppConfig, AppConfigProd);
          break;
      }
    }
  }

  toggleSideBar() {
    MenuListItemComponent.expandedItem = undefined;
    this.menu.showCompleteMenu = !this.menu.showCompleteMenu;
  }
}
