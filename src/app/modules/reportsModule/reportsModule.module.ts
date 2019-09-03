import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {MatDialogModule} from '@angular/material';
import {BeneficiariesModule} from '../beneficiaries/beneficiaries.module';
import {ErrorDialog} from '../../shared/components/error-modal/error-dialog-component';
import {MessageDialog} from '../../shared/components/message-dialog/message-dialog.component';
import {AlterDialog} from '../../shared/components/alter-dialog/alter-dialog.component';
import {DecisionDialog} from '../../shared/components/decision-dialog/decision-dialog.component';
import { ReportsModuleComponent } from './pages/reports-module/reports-module.component';
import {ReportsModuleRoutingModule} from './reportsModule-routing.module';
import { ReportsModuleFilterComponent } from './components/reports-module-filter/reports-module-filter.component';
import { ReportsModuleListComponent } from './components/reports-module-list/reports-module-list.component';
import { ReportsModuleDeleteFilterComponent } from './components/reports-module-delete-filter/reports-module-delete-filter.component';
import { ReportsModuleConfirmComponent } from './pages/reports-module-confirm/reports-module-confirm.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatDialogModule,
    BeneficiariesModule,
    ReportsModuleRoutingModule
  ],
  declarations: [
  ReportsModuleComponent,
  ReportsModuleFilterComponent,
  ReportsModuleListComponent,
  ReportsModuleDeleteFilterComponent,
  ReportsModuleConfirmComponent],
  entryComponents: [
    ErrorDialog,
    MessageDialog,
    AlterDialog,
    DecisionDialog
  ],
  exports: []
})

export class ReportsModuleModule {
}
