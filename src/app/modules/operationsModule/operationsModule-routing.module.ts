import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OperationsPageComponent} from './pages/operations-page/operations-page.component';

const operationsModuleRoutes: Routes = [
  {
    path: '',
    component: OperationsPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(operationsModuleRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class OperationsModuleRoutingModule {
}
