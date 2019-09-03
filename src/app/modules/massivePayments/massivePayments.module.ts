import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {MassivePaymentsRoutingModule} from './massivePayments-routing.module';
import {MassivePaymentsWizardComponent} from './pages/massive-payments-wizard/massive-payments-wizard.component';
import {InitialSelectionComponent} from './pages/initial-selection/initial-selection.component';
import {OperationFilterComponent} from './components/operation-filter/operation-filter.component';
import {UploadFileComponent} from './pages/upload-file/upload-file.component';
import {UploadFileSectionComponent} from './components/upload-file-section/upload-file-section.component';
import {ConfirmFileComponent} from './pages/confirm-file/confirm-file.component';
import {FileDetailComponent} from './components/file-detail/file-detail.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MassivePaymentsRoutingModule
  ],
  declarations: [
    MassivePaymentsWizardComponent,
    InitialSelectionComponent,
    OperationFilterComponent,
    UploadFileComponent,
    UploadFileSectionComponent,
    ConfirmFileComponent,
    FileDetailComponent],
  entryComponents: [],
  exports: [
    ConfirmFileComponent
  ]
})

export class MassivePaymentsModule {
}
