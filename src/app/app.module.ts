import {LOCALE_ID, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core/core.module';
import {AppComponent} from './app.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {WebpackTranslateLoader} from './webpack-translate-loader';
import {AppConfig} from './configs/app.config';
import {SharedModule} from './shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgScrollbarModule} from 'ngx-scrollbar';
import localeMX from '@angular/common/locales/es-MX';
import {registerLocaleData} from '@angular/common';
import {UserIdleModule} from 'angular-user-idle';

registerLocaleData(localeMX, 'es-MX');

@NgModule({
  imports: [
    // ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader
      }
    }),
    CoreModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgScrollbarModule,
    UserIdleModule.forRoot({idle: 1, timeout: AppConfig.sessionTime, ping: 99999999999999999})
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'es-MX'}
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
