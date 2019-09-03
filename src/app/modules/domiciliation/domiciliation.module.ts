import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {MessageDialog} from 'src/app/shared/components/message-dialog/message-dialog.component';
import {MassivePaymentsModule} from '../massivePayments/massivePayments.module';
import {DomiciliationRoutingModule} from './domiciliation-routing.module';
import { DomiciliationWizardComponent } from './pages/domiciliation-wizard/domiciliation-wizard.component';
import { DomiciliationEditionComponent } from './pages/domiciliation-edition/domiciliation-edition.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DomiciliationRoutingModule,
    MassivePaymentsModule
  ],
  declarations: [DomiciliationWizardComponent, DomiciliationEditionComponent],
  entryComponents: [
    MessageDialog
  ],
  exports: [
    DomiciliationWizardComponent,
    DomiciliationEditionComponent
  ]
})

export class DomiciliationModule {
}
