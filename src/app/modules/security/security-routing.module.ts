import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {AppConfig} from '../../configs/app.config';
import {UserRolesPageComponent} from './pages/roles-administration/user-roles-page.component';
import {RolesComponent} from './pages/roles/roles.component';

const loginRoutes: Routes = [
  {
    path: AppConfig.routes.security.login,
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: '/' + AppConfig.routes.security + '/' + AppConfig.routes.security.login,
    pathMatch: 'full'
  },
  {
    path: AppConfig.routes.security.userRoles,
    component: UserRolesPageComponent
  },
  {
    path: AppConfig.routes.security.roles,
    component: RolesComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(loginRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class SecurityRoutingModule {
}
