import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReferencedPaymentWizardComponent} from './pages/referenced-payment-wizard/referenced-payment-wizard.component';

const referencedPaymentRoutes: Routes = [
  {
    path: '',
    component: ReferencedPaymentWizardComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(referencedPaymentRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class ReferencedPaymentRoutingModule {
}
