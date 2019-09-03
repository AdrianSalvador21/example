import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {MatDialogModule} from '@angular/material';
import {BeneficiariesModule} from '../beneficiaries/beneficiaries.module';
import {ErrorDialog} from '../../shared/components/error-modal/error-dialog-component';
import {MessageDialog} from '../../shared/components/message-dialog/message-dialog.component';
import {AlterDialog} from '../../shared/components/alter-dialog/alter-dialog.component';
import {OperationsHistoryRoutingModule} from './operationsHistory-routing.module';
import { BeneficiariesHistoryComponent } from './pages/beneficiaries-history/beneficiaries-history.component';
import { BeneficiariesHistoryFilterComponent } from './components/beneficiaries-history-filter/beneficiaries-history-filter.component';
import { BeneficiariesHistoryListComponent } from './components/beneficiaries-history-list/beneficiaries-history-list.component';
import { ReferencedPaymentHistoryComponent } from './pages/referenced-payment-history/referenced-payment-history.component';
import { ReferencedPaymentFilterComponent } from './components/referenced-payment-filter/referenced-payment-filter.component';
import { ReferencedPaymentListComponent } from './components/referenced-payment-list/referenced-payment-list.component';
import { BeneficiariesHistoryWizardComponent } from './pages/beneficiaries-history-wizard/beneficiaries-history-wizard.component';
import { ReferencedPaymentHistoryWizardComponent } from './pages/referenced-payment-history-wizard/referenced-payment-history-wizard.component';
import {ReferencedPaymentModule} from '../referencedPayment/referencedPayment.module';
import { ReferencedPaymentHistoryDetailComponent } from './pages/referenced-payment-history-detail/referenced-payment-history-detail.component';
import { BeneficiariesHistoryDetailComponent } from './pages/beneficiaries-history-detail/beneficiaries-history-detail.component';



@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatDialogModule,
    BeneficiariesModule,
    ReferencedPaymentModule,
    OperationsHistoryRoutingModule
  ],
  declarations: [

  BeneficiariesHistoryComponent,

  BeneficiariesHistoryFilterComponent,

  BeneficiariesHistoryListComponent,

  ReferencedPaymentHistoryComponent,

  ReferencedPaymentFilterComponent,

  ReferencedPaymentListComponent,

  BeneficiariesHistoryWizardComponent,

  ReferencedPaymentHistoryWizardComponent,

  ReferencedPaymentHistoryDetailComponent,

  BeneficiariesHistoryDetailComponent],
  entryComponents: [
    ErrorDialog,
    MessageDialog,
    AlterDialog
  ],
  exports: []
})

export class OperationsHistoryModule {
}
