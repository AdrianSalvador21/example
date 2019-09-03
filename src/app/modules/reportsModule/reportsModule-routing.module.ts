import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReportsModuleComponent} from './pages/reports-module/reports-module.component';

const reportsModuleRoutes: Routes = [
  {
    path: '',
    component: ReportsModuleComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(reportsModuleRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class ReportsModuleRoutingModule {
}
