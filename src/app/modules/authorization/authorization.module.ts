import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthorizationRoutingModule} from './authorization-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {AuthorizationFilterComponent} from './components/authorization-filter';
import {BeneficiaryAuthorizationListComponent} from './components/beneficiary-authorization-list';
import {BatchAuthorizationListComponent} from './components/batch-authorization-list';
import {ClarificationAuthorizationListComponent} from './components/clarification-authorization-list';
import {IssuesAuthorizationListComponent} from './components/issues-authorization-list';
import {ReferencedDepositAuthorizationListComponent} from './components/referencedDeposit-authorization-list';
import {AuthorizationButtonPanelComponent} from './components/authorization-buttonPanel';
import {MatDialogModule, MatPaginatorIntl} from '@angular/material';
import {FileQueryAuthorizationListComponent} from './components/fileQuery-authorization-list';
import {UnitQueryAuthorizationListComponent} from './components/unitQuery-authorization-list';
import {ErrorDialog} from 'src/app/shared/components/error-modal/error-dialog-component';
import {MessageDialog} from '../../shared/components/message-dialog/message-dialog.component';
import {AlterDialog} from '../../shared/components/alter-dialog/alter-dialog.component';
import {FileQueryModule} from '../fileQuery/fileQuery.module';
import {MassivePaymentsModule} from '../massivePayments/massivePayments.module';
import {BeneficiariesModule} from '../beneficiaries/beneficiaries.module';
import {MassivePaymentDetailsComponent} from './components/massive-payment-details/massive-payment-details.component';
import {MassivePaymentHaDetailsComponent} from './components/massive-payment-ha-details/massive-payment-ha-details.component';
import {ReferencedPaymentModule} from '../referencedPayment/referencedPayment.module';
import {AuthorizationSingleSignaturePageComponent} from './pages/authorization/authorization-single-signature-page.component';
import {AuthorizationTwoSignaturesPageComponent} from './pages/authorization/authorization-two-signatures-page.component';


export class CustomMatPagIntl extends MatPaginatorIntl {
  constructor() {
    super();
    this.nextPageLabel = 'Página siguiente';
    this.previousPageLabel = 'Página anterior';
    this.itemsPerPageLabel = 'Operaciones por página';
    this.lastPageLabel = 'Última página';
    this.firstPageLabel = 'Primera página';
  }
}

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AuthorizationRoutingModule,
    MatDialogModule,
    FileQueryModule,
    MassivePaymentsModule,
    BeneficiariesModule,
    ReferencedPaymentModule
  ],
  declarations: [
    AuthorizationSingleSignaturePageComponent,
    AuthorizationTwoSignaturesPageComponent,
    AuthorizationFilterComponent,
    BeneficiaryAuthorizationListComponent,
    BatchAuthorizationListComponent,
    ClarificationAuthorizationListComponent,
    IssuesAuthorizationListComponent,
    ReferencedDepositAuthorizationListComponent,
    UnitQueryAuthorizationListComponent,
    FileQueryAuthorizationListComponent,
    AuthorizationButtonPanelComponent,
    MassivePaymentDetailsComponent,
    MassivePaymentHaDetailsComponent
  ],
  entryComponents: [
    ErrorDialog,
    MessageDialog,
    AlterDialog
  ],
  providers: [{
    provide: MatPaginatorIntl, useClass: CustomMatPagIntl
  }]
})

export class AuthorizationModule {
}
