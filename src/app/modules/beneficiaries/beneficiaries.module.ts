import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BeneficiariesRoutingModule} from './beneficiaries-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {BeneficiariesEditionPageComponent} from './pages/beneficiaries-edition/beneficiaries-edition-page.component';
import {BeneficiaryOperatorFilterComponent} from './components/beneficiary-operator-filter';
import {BeneficiaryDetailsComponent} from './components/beneficiary-details';
import {MatDialogModule, MatPaginatorIntl} from '@angular/material';
import {BeneficiariesConfirmInternationalComponent} from './pages/beneficiaries-confirm/beneficiaries-confirm.component';
import {BeneficiaryConfirmSectionComponent} from './components/beneficiary-confirm-section/beneficiary-confirm-section.component';
import {BeneficiariesWizardComponent} from './pages/beneficiaries-wizard/beneficiaries-wizard.component';
import {ErrorDialog} from 'src/app/shared/components/error-modal/error-dialog-component';
import {MessageDialog} from '../../shared/components/message-dialog/message-dialog.component';
import {AlterDialog} from '../../shared/components/alter-dialog/alter-dialog.component';


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
    BeneficiariesRoutingModule,
    MatDialogModule
  ],
  declarations: [
    BeneficiariesEditionPageComponent,
    BeneficiaryOperatorFilterComponent,
    BeneficiaryDetailsComponent,
    BeneficiariesConfirmInternationalComponent,
    BeneficiaryConfirmSectionComponent,
    BeneficiariesWizardComponent,
  ],
  entryComponents: [
    ErrorDialog,
    MessageDialog,
    AlterDialog
  ],
  providers: [{
    provide: MatPaginatorIntl, useClass: CustomMatPagIntl
  }],
  exports: [
    BeneficiariesConfirmInternationalComponent,
    BeneficiaryDetailsComponent,
    BeneficiaryConfirmSectionComponent
  ]
})

export class BeneficiariesModule {
}
