import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BlockedTransactionsWizardComponent} from './pages/blocked-transactions-wizard/blocked-transactions-wizard.component';

const blockedTranstactionsRoutes: Routes = [
  {
    path: '',
    component: BlockedTransactionsWizardComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(blockedTranstactionsRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class BlockedTransactionsRoutingModule {
}
