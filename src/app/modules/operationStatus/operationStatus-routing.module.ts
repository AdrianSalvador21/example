import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppConfig} from '../../configs/app.config';
import {OperationStatusBasicComponent} from './pages/operation-status/operation-status-basic.component';
import {OperationStatusFullComponent} from './pages/operation-status/operation-status-full.component';

const operationStatusRoutes: Routes = [
  {path: AppConfig.routes.operation.statusBasic, component: OperationStatusBasicComponent},
  {path: AppConfig.routes.operation.statusFull, component: OperationStatusFullComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(operationStatusRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class OperationStatusRoutingModule {
}
