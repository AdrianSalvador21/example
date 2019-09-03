import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppConfig} from '../../configs/app.config';
import {OperatorPldWizardComponent} from './pages/operator-pld-wizard/operator-pld-wizard.component';

const operationStatusRoutes: Routes = [
  {path: AppConfig.routes.operator.pld, component: OperatorPldWizardComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(operationStatusRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class OperatorPldRoutingModule {
}
