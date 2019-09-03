import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppConfig} from '../../configs/app.config';
import {BeneficiaryDetailsComponent} from './components/beneficiary-details';
import {BeneficiariesWizardComponent} from './pages/beneficiaries-wizard/beneficiaries-wizard.component';

const beneficiariesRoutes: Routes = [
  {
    path: AppConfig.routes.beneficiaries.details,
    component: BeneficiaryDetailsComponent
  },
  {
    path: AppConfig.routes.beneficiaries.edition,
    component: BeneficiariesWizardComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(beneficiariesRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class BeneficiariesRoutingModule {
}
