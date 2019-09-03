import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {MatDialogModule} from '@angular/material';
import {ErrorDialog} from '../../shared/components/error-modal/error-dialog-component';
import {MessageDialog} from '../../shared/components/message-dialog/message-dialog.component';
import {AlterDialog} from '../../shared/components/alter-dialog/alter-dialog.component';
import {BeneficiariesModule} from '../beneficiaries/beneficiaries.module';
import {OperatorPldRoutingModule} from './operatorPld-routing.module';
import {OperatorPldWizardComponent} from './pages/operator-pld-wizard/operator-pld-wizard.component';
import {BeneficiariesPldComponent} from './pages/beneficiaries-pld/beneficiaries-pld.component';
import {BeneficiariesPldFilterComponent} from './components/beneficiaries-pld-filter/beneficiaries-pld-filter.component';
import {BeneficiariesPldListComponent} from './components/beneficiaries-pld-list/beneficiaries-pld-list.component';
import {BeneficiariesPldDetailComponent} from './pages/beneficiaries-pld-detail/beneficiaries-pld-detail.component';
import {DownloadPldComponent} from './pages/download-pld/download-pld.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatDialogModule,
    BeneficiariesModule,
    OperatorPldRoutingModule
  ],
  declarations: [OperatorPldWizardComponent, BeneficiariesPldComponent, BeneficiariesPldFilterComponent, BeneficiariesPldListComponent, BeneficiariesPldDetailComponent, DownloadPldComponent],
  entryComponents: [
    ErrorDialog,
    MessageDialog,
    AlterDialog
  ],
  exports: []
})

export class OperatorPldModule {
}
