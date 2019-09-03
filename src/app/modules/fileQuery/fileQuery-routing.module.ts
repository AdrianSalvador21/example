import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppConfig} from '../../configs/app.config';
import {IssueDetailComponent} from './pages/issue-detail/issue-detail.component';
import {FileQueryWizardPageComponent} from './pages/fileQuery-wizard/fileQuery-wizard-page.component';
import {ClarificationsWizardComponent} from './pages/clarifications-wizard/clarifications-wizard.component';
import {IssuesWizardComponent} from './pages/issues-wizard/issues-wizard.component';

const fileQueryRoutes: Routes = [
  {path: AppConfig.routes.fileQuery.operator, component: FileQueryWizardPageComponent},
  {path: AppConfig.routes.fileQuery.issues, component: IssuesWizardComponent},
  // {path: AppConfig.routes.fileQuery.issues, component: IssuesPageComponent},
  {path: AppConfig.routes.fileQuery.issueDetail, component: IssueDetailComponent},
  //{path: AppConfig.routes.fileQuery.clarifications, component: ClarificationsComponent}
  {path: AppConfig.routes.fileQuery.clarifications, component: ClarificationsWizardComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(fileQueryRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class FileQueryRoutingModule {
}
