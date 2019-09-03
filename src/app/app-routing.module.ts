import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppConfig} from './configs/app.config';
import {AuthGuard} from './core/guards';
import {Error404PageComponent} from './shared/pages/error404-page/error404-page.component';
// @ts-ignore
import {Profile} from './shared/models';

const routes: Routes = [
  {
    path: AppConfig.routes.authorization.root,
    loadChildren: './modules/authorization/authorization.module#AuthorizationModule',
    canActivate: [AuthGuard],
    data: {roles: [Profile.amountApprover, Profile.approver]}
  },
  {
    path: AppConfig.routes.beneficiaries.root,
    loadChildren: './modules/beneficiaries/beneficiaries.module#BeneficiariesModule',
    canActivate: [AuthGuard],
    data: {roles: [Profile.consultive, Profile.dataCapture]}
  },
  {
    path: AppConfig.routes.history.root,
    loadChildren: './modules/operationsHistory/operationsHistory.module#OperationsHistoryModule',
    canActivate: [AuthGuard],
    data: {roles: [Profile.dataCapture, Profile.consultive, Profile.approver, Profile.amountApprover]}
  },
  {
    path: AppConfig.routes.referencedPayment.root,
    loadChildren: './modules/referencedPayment/referencedPayment.module#ReferencedPaymentModule',
    canActivate: [AuthGuard],
    data: {roles: [Profile.dataCapture]}
  },
  {
    path: AppConfig.routes.operationsModule.root,
    loadChildren: './modules/operationsModule/operationsModule.module#OperationsModuleModule',
    canActivate: [AuthGuard],
    data: {roles: [Profile.dataCapture]}
  },
  {
    path: AppConfig.routes.collectionModule.root,
    loadChildren: './modules/collection/collection.module#CollectionModule',
    canActivate: [AuthGuard],
    data: {roles: [Profile.dataCapture]}
  },
  {
    path: AppConfig.routes.domiciliationModule.root,
    loadChildren: './modules/domiciliation/domiciliation.module#DomiciliationModule',
    canActivate: [AuthGuard],
    data: {roles: [Profile.dataCapture]}
  },
  {
    path: AppConfig.routes.operation.root,
    loadChildren: './modules/operationStatus/operationStatus.module#OperationStatusModule',
    canActivate: [AuthGuard],
    data: {roles: [Profile.dataCapture, Profile.approver, Profile.amountApprover, Profile.consultive]}
  },
  {
    path: AppConfig.routes.operator.root,
    loadChildren: './modules/operatorPld/operatorPld.module#OperatorPldModule',
    canActivate: [AuthGuard],
    data: {roles: [Profile.dataCapture]}
  },
  {
    path: AppConfig.routes.blockedTransactions.root,
    loadChildren: './modules/blockedTransactions/blockedTransactions.module#BlockedTransactionsModule',
    canActivate: [AuthGuard],
    data: {roles: [Profile.dataCapture]}
  },
  {
    path: AppConfig.routes.reportsModule.root,
    loadChildren: './modules/reportsModule/reportsModule.module#ReportsModuleModule',
    canActivate: [AuthGuard],
    data: {roles: [Profile.dataCapture]}
  },
  {
    path: AppConfig.routes.security.root,
    loadChildren: './modules/security/security.module#SecurityModule',
    canActivate: [AuthGuard],
    data: {roles: [Profile.admin, Profile.dataCapture]}
  },
  {
    path: AppConfig.routes.massivePayments.root,
    loadChildren: './modules/massivePayments/massivePayments.module#MassivePaymentsModule',
    canActivate: [AuthGuard],
    data: {roles: [Profile.dataCapture]}
  },
  {
    path: AppConfig.routes.fileQuery.root,
    loadChildren: './modules/fileQuery/fileQuery.module#FileQueryModule',
    canActivate: [AuthGuard],
    data: {roles: [Profile.dataCapture, Profile.consultive]}
  },
  {
    path: AppConfig.routes.error404,
    component: Error404PageComponent
  },
  {
    path: '',
    redirectTo: '/' + AppConfig.routes.security.root + '/' + AppConfig.routes.security.login,
    pathMatch: 'full',
  },
  // otherwise redirect to 404
  {
    path: '**',
    redirectTo: '/' + AppConfig.routes.error404
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      useHash: true
    })
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {
}
