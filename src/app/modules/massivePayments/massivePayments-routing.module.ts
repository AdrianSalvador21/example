import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppConfig} from '../../configs/app.config';
import {MassivePaymentsWizardComponent} from './pages/massive-payments-wizard/massive-payments-wizard.component';

const paymentsDispersionRoutes: Routes = [
  {path: AppConfig.routes.massivePayments.file, component: MassivePaymentsWizardComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(paymentsDispersionRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class MassivePaymentsRoutingModule {
}
