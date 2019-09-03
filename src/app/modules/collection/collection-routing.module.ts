import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CollectionWizardComponent} from './pages/collection-wizard/collection-wizard.component';

const collectionRoutes: Routes = [
  {path: '', component: CollectionWizardComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(collectionRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class CollectionRoutingModule {
}
