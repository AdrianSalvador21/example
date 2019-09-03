import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DomiciliationWizardComponent} from './pages/domiciliation-wizard/domiciliation-wizard.component';

const domiciliationRoutes: Routes = [
  {path: '', component: DomiciliationWizardComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(domiciliationRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class DomiciliationRoutingModule {
}
