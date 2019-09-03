import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {MatDialogModule} from '@angular/material';
import {BeneficiariesModule} from '../beneficiaries/beneficiaries.module';
import {ErrorDialog} from '../../shared/components/error-modal/error-dialog-component';
import {MessageDialog} from '../../shared/components/message-dialog/message-dialog.component';
import {AlterDialog} from '../../shared/components/alter-dialog/alter-dialog.component';
import {DecisionDialog} from '../../shared/components/decision-dialog/decision-dialog.component';
import {ReferencedPaymentRoutingModule} from './referencedPayment-routing.module';
import { ReferencedPaymentWizardComponent } from './pages/referenced-payment-wizard/referenced-payment-wizard.component';
import { ReferencedPaymentComponent } from './pages/referenced-payment/referenced-payment.component';
import { ReferencedPaymentFilterComponent } from './components/referenced-payment-filter/referenced-payment-filter.component';
import { ReferencedPaymentSelectComponent } from './components/referenced-payment-select/referenced-payment-select.component';
import { ReferencedPaymentConfirmComponent } from './pages/referenced-payment-confirm/referenced-payment-confirm.component';
import { ReferencedPaymentListComponent } from './components/referenced-payment-list/referenced-payment-list.component';
import { ReferencedPaymentDetailComponent } from './pages/referenced-payment-detail/referenced-payment-detail.component';
import { ReferencedPaymentDetailSectionComponent } from './components/referenced-payment-detail-section/referenced-payment-detail-section.component';
import { ReferencedPaymentDetailAccountsComponent } from './components/referenced-payment-detail-accounts/referenced-payment-detail-accounts.component';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatDialogModule,
    BeneficiariesModule,
    ReferencedPaymentRoutingModule
  ],
  declarations: [ReferencedPaymentWizardComponent,
    ReferencedPaymentComponent,
    ReferencedPaymentFilterComponent,
    ReferencedPaymentSelectComponent,
    ReferencedPaymentConfirmComponent,
    ReferencedPaymentListComponent,
    ReferencedPaymentDetailComponent,
    ReferencedPaymentDetailSectionComponent,
    ReferencedPaymentDetailAccountsComponent],
  entryComponents: [
    ErrorDialog,
    MessageDialog,
    AlterDialog,
    DecisionDialog
  ],
  exports: [
    ReferencedPaymentDetailComponent,
    ReferencedPaymentDetailSectionComponent,
    ReferencedPaymentDetailAccountsComponent
  ]
})

export class ReferencedPaymentModule {
}
