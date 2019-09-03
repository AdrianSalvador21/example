import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthorizationSingleSignaturePageComponent} from './pages/authorization/authorization-single-signature-page.component';
import {AuthorizationTwoSignaturesPageComponent} from './pages/authorization/authorization-two-signatures-page.component';
import {AppConfig} from '../../configs/app.config';

const authorizationRoutes: Routes = [
  {
    path: AppConfig.routes.authorization.single,
    component: AuthorizationSingleSignaturePageComponent
  },
  {
    path: AppConfig.routes.authorization.two,
    component: AuthorizationTwoSignaturesPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(authorizationRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class AuthorizationRoutingModule {
}
