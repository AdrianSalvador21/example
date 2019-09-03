import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {LoginComponent} from './pages';
import {SecurityRoutingModule} from './security-routing.module';
import {ProfileButtonPanelComponent} from './components/profile-buttonPanel';
import {ProfileFilterComponent} from './components/profile-filter';
import {ProfilesDetailsComponent} from './components/profiles-detail/profiles-details.component';
import {UserRolesPageComponent} from './pages/roles-administration/user-roles-page.component';
import {RolesComponent} from './pages/roles/roles.component';
import {RolesUpdateComponent} from './components/roles-update/roles-update.component';
import {RolesUpdateFilterComponent} from './components/roles-update-filter/roles-update-filter.component';
import {RolesUpdateGridComponent} from './components/roles-update-grid/roles-update-grid.component';
import {MenuUpdateComponent} from './pages/menu-update/menu-update.component';
import {MenuUpdateGridComponent} from './components/menu-update-grid/menu-update-grid.component';
import { ProfileConfigComponent } from './pages/profile-config/profile-config.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SecurityRoutingModule
  ],
  declarations: [
    LoginComponent,
    UserRolesPageComponent,
    ProfileButtonPanelComponent,
    ProfileFilterComponent,
    ProfilesDetailsComponent,
    RolesComponent,
    RolesUpdateComponent,
    RolesUpdateFilterComponent,
    RolesUpdateGridComponent,
    MenuUpdateComponent,
    MenuUpdateGridComponent,
    ProfilesDetailsComponent,
    ProfileConfigComponent
  ]
})

export class SecurityModule {
}
