import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {OperationStatusRoutingModule} from './operationStatus-routing.module';
import {OperationStatusComponent} from './pages/operation-status/operation-status.component';
import {MatDialogModule} from '@angular/material';
import {FileQueryModule} from '../fileQuery/fileQuery.module';
import {MassivePaymentsModule} from '../massivePayments/massivePayments.module';
import {ErrorDialog} from '../../shared/components/error-modal/error-dialog-component';
import {MessageDialog} from '../../shared/components/message-dialog/message-dialog.component';
import {AlterDialog} from '../../shared/components/alter-dialog/alter-dialog.component';
import {BeneficiariesModule} from '../beneficiaries/beneficiaries.module';
import {OperationStatusFilterComponent} from './components/operation-status-filter/operation-status-filter.component';
import {OperationBeneficiariesListComponent} from './components/operation-beneficiaries-list/operation-beneficiaries-list.component';
import {OperationMassiveListComponent} from './components/operation-massive-list/operation-massive-list.component';
import {OperationReferencedDepositListComponent} from './components/operation-referenced-deposit-list/operation-referenced-deposit-list.component';
import {OperationIssuesListComponent} from './components/operation-issues-list/operation-issues-list.component';
import {OperationUnitQueryListComponent} from './components/operation-unit-query-list/operation-unit-query-list.component';
import {OperationClarificationListComponent} from './components/operation-clarification-list/operation-clarification-list.component';
import {OperationFileQueryListComponent} from './components/operation-file-query-list/operation-file-query-list.component';
import {OperationDetailComponent} from './pages/operation-detail/operation-detail.component';
import {ReferencedPaymentModule} from '../referencedPayment/referencedPayment.module';
import {OperationStatusFullComponent} from './pages/operation-status/operation-status-full.component';
import {OperationStatusBasicComponent} from './pages/operation-status/operation-status-basic.component';
import { OperationStatusFullFilterComponent } from './components/operation-status-full-filter/operation-status-full-filter.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    OperationStatusRoutingModule,
    MatDialogModule,
    FileQueryModule,
    MassivePaymentsModule,
    BeneficiariesModule,
    ReferencedPaymentModule
  ],
  declarations: [
    OperationStatusFullComponent,
    OperationStatusBasicComponent,
    OperationStatusFilterComponent,
    OperationBeneficiariesListComponent,
    OperationMassiveListComponent,
    OperationReferencedDepositListComponent,
    OperationIssuesListComponent,
    OperationUnitQueryListComponent,
    OperationClarificationListComponent,
    OperationFileQueryListComponent,
    OperationDetailComponent,
    OperationStatusFullFilterComponent
  ],
  entryComponents: [
    ErrorDialog,
    MessageDialog,
    AlterDialog
  ],
  exports: []
})

export class OperationStatusModule {
}
