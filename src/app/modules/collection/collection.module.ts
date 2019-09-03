import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {MessageDialog} from 'src/app/shared/components/message-dialog/message-dialog.component';
import {MassivePaymentsModule} from '../massivePayments/massivePayments.module';
import {CollectionRoutingModule} from './collection-routing.module';
import { CollectionWizardComponent } from './pages/collection-wizard/collection-wizard.component';
import { CollectionFilterComponent } from './components/collection-filter/collection-filter.component';
import { CollectionEditionComponent } from './pages/collection-edition/collection-edition.component';
import { CollectionDetailComponent } from './components/collection-detail/collection-detail.component';
import { CollectionGeneralDataComponent } from './components/collection-general-data/collection-general-data.component';
import { CollectionOperationChannelsComponent } from './components/collection-operation-channels/collection-operation-channels.component';
import { CollectionAccountsDataComponent } from './components/collection-accounts-data/collection-accounts-data.component';
import { CollectionPaymentsTypesComponent } from './components/collection-payments-types/collection-payments-types.component';
import { CollectionCaptureInstructionsComponent } from './components/collection-capture-instructions/collection-capture-instructions.component';
import { CollectionOverduePaymentsReceptionComponent } from './components/collection-overdue-payments-reception/collection-overdue-payments-reception.component';
import { CollectionFileGenerationComponent } from './components/collection-file-generation/collection-file-generation.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CollectionRoutingModule,
    MassivePaymentsModule
  ],
  declarations: [
  CollectionWizardComponent,
  CollectionFilterComponent,
  CollectionEditionComponent,
  CollectionDetailComponent,
  CollectionGeneralDataComponent,
  CollectionOperationChannelsComponent,
  CollectionAccountsDataComponent,
  CollectionPaymentsTypesComponent,
  CollectionCaptureInstructionsComponent,
  CollectionOverduePaymentsReceptionComponent,
  CollectionFileGenerationComponent],
  entryComponents: [
    MessageDialog
  ],
  exports: [
    CollectionWizardComponent
  ]
})

export class CollectionModule {
}
