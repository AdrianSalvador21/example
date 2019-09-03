import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppConfig} from '../../configs/app.config';
import {BeneficiariesHistoryWizardComponent} from './pages/beneficiaries-history-wizard/beneficiaries-history-wizard.component';
import {ReferencedPaymentHistoryWizardComponent} from './pages/referenced-payment-history-wizard/referenced-payment-history-wizard.component';

const operationsHistoryRoutes: Routes = [
  {path: AppConfig.routes.history.beneficiaries, component: BeneficiariesHistoryWizardComponent},
  {path: AppConfig.routes.history.referencedDeposit, component: ReferencedPaymentHistoryWizardComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(operationsHistoryRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class OperationsHistoryRoutingModule {
}
