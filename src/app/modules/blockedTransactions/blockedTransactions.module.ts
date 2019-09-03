import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {MatDialogModule} from '@angular/material';
import {BeneficiariesModule} from '../beneficiaries/beneficiaries.module';
import {ErrorDialog} from '../../shared/components/error-modal/error-dialog-component';
import {MessageDialog} from '../../shared/components/message-dialog/message-dialog.component';
import {AlterDialog} from '../../shared/components/alter-dialog/alter-dialog.component';
import {BlockedTransactionsWizardComponent} from './pages/blocked-transactions-wizard/blocked-transactions-wizard.component';
import {BlockedTransactionsRoutingModule} from './blockedTransactions-routing.module';
import {BlockedTransactionsComponent} from './pages/blocked-transactions/blocked-transactions.component';
import {BlockedTransactionsFilterComponent} from './components/blocked-transactions-filter/blocked-transactions-filter.component';
import {BlockedTransactionListComponent} from './components/blocked-transaction-list/blocked-transaction-list.component';
import {DecisionDialog} from '../../shared/components/decision-dialog/decision-dialog.component';
import {BlockedTransactionsDetailComponent} from './pages/blocked-transactions-detail/blocked-transactions-detail.component';
import {BlockedTransactionSeccionComponent} from './components/blocked-transaction-seccion/blocked-transaction-seccion.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatDialogModule,
    BeneficiariesModule,
    BlockedTransactionsRoutingModule
  ],
  declarations: [BlockedTransactionsWizardComponent, BlockedTransactionsComponent, BlockedTransactionsFilterComponent, BlockedTransactionListComponent, BlockedTransactionsDetailComponent, BlockedTransactionSeccionComponent],
  entryComponents: [
    ErrorDialog,
    MessageDialog,
    AlterDialog,
    DecisionDialog
  ],
  exports: []
})

export class BlockedTransactionsModule {
}
