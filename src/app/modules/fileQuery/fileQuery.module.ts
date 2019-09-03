import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {FileQueryRoutingModule} from './fileQuery-routing.module';
import {FileQueryOperatorPageComponent} from './pages/fileQuery-operator';
import {FileQueryOperatorButtonPanelComponent} from './components/fileQuery/fileQuery-operator-buttonPanel';
import {FileQueryOperatorFilterComponent} from './components/fileQuery/fileQuery-operator-filter';
import {FileQueryOperatorListComponent} from './components/fileQuery/fileQuery-operator-list';
import {IssuesFilterComponent} from './components/issues/issues-filter';
import {IssuesListComponent} from './components/issues/issues-list';
import {IssuesPageComponent} from './pages/issues/issues-page.component';
import {IssueDetailComponent} from './pages/issue-detail/issue-detail.component';
import {IssueDetailListComponent} from './components/issue-detail/issue-detail-list/issue-detail-list.component';
import {IssueDetailSectionComponent} from './components/issue-detail/issue-detail-section/issue-detail-section.component';
import {FileDetailOperatorComponent} from './pages/fileDetail-operator';
import {FileDetailInfoListComponent} from './components/fileDetail/fileDetail-info-list';
import {IssueDetailButtonPanelComponent} from './components/issue-detail/issue-detail-button-panel/issue-detail-button-panel.component';
import {ClarificationsComponent} from './pages/clarifications/clarifications.component';
import {ClarificationsFilterComponent} from './components/clarifications/clarifications-filter/clarifications-filter.component';
import {ClarificationsListComponent} from './components/clarifications/clarifications-list/clarifications-list.component';
import {FileDetailOperatorButtonPanelComponent} from './components/fileDetail/fileDetail-operator-buttonPanel';
import {FileDetailPaymentItemsListComponent} from './components/fileDetail/fileDetail-paymentItems-list';
import {FileDetailTrackingListComponent} from './components/fileDetail/fileDetail-tracking-list';
import {FileQueryWizardPageComponent} from './pages/fileQuery-wizard/fileQuery-wizard-page.component';
import {ClarificationsWizardComponent} from './pages/clarifications-wizard/clarifications-wizard.component';
import {MessageDialog} from 'src/app/shared/components/message-dialog/message-dialog.component';
import {IssuesWizardComponent} from './pages/issues-wizard/issues-wizard.component';
import {MassivePaymentsModule} from '../massivePayments/massivePayments.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FileQueryRoutingModule,
    MassivePaymentsModule
  ],
  declarations: [
    FileQueryOperatorPageComponent,
    FileQueryOperatorButtonPanelComponent,
    FileQueryOperatorFilterComponent,
    FileQueryOperatorListComponent,
    IssuesFilterComponent,
    IssuesListComponent,
    IssuesPageComponent,
    IssueDetailComponent,
    IssueDetailListComponent,
    IssueDetailSectionComponent,
    IssueDetailButtonPanelComponent,
    ClarificationsComponent,
    ClarificationsFilterComponent,
    ClarificationsListComponent,
    FileDetailOperatorComponent,
    FileDetailInfoListComponent,
    IssueDetailButtonPanelComponent,
    FileDetailOperatorButtonPanelComponent,
    FileDetailPaymentItemsListComponent,
    FileDetailTrackingListComponent,
    FileQueryWizardPageComponent,
    ClarificationsWizardComponent,
    IssuesWizardComponent,
  ],
  entryComponents: [
    MessageDialog
  ],
  exports: [
    IssueDetailComponent,
    IssueDetailComponent,
    FileDetailOperatorComponent,
    FileDetailTrackingListComponent
  ]
})

export class FileQueryModule {
}
