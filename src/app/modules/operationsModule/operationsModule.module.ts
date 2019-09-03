import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {MatDialogModule} from '@angular/material';
import {BeneficiariesModule} from '../beneficiaries/beneficiaries.module';
import {ErrorDialog} from '../../shared/components/error-modal/error-dialog-component';
import {MessageDialog} from '../../shared/components/message-dialog/message-dialog.component';
import {AlterDialog} from '../../shared/components/alter-dialog/alter-dialog.component';
import {OperationsModuleRoutingModule} from './operationsModule-routing.module';
import {DecisionDialog} from '../../shared/components/decision-dialog/decision-dialog.component';
import { OperationsPageComponent } from './pages/operations-page/operations-page.component';
import { OperationsFilterComponent } from './components/operations-filter/operations-filter.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatDialogModule,
    BeneficiariesModule,
    OperationsModuleRoutingModule
  ],
  declarations: [OperationsPageComponent, OperationsFilterComponent],
  entryComponents: [
    ErrorDialog,
    MessageDialog,
    AlterDialog,
    DecisionDialog
  ],
  exports: []
})

export class OperationsModuleModule {
}
