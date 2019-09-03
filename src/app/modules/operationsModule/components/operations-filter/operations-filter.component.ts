import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {AppConfig} from '../../../../configs/app.config';
import {MatStepper} from '@angular/material';
import {BaseComponent} from '../../../../shared/components/base/base.component';

@Component({
  selector: 'two-operations-filter',
  templateUrl: './operations-filter.component.html',
  styleUrls: ['./operations-filter.component.scss']
})
export class OperationsFilterComponent extends BaseComponent implements OnInit {
  @Input() stepper: MatStepper;
  operationForm = this.fb.group({
    operationType: ['1'],
  });
  paymentTypeForm = this.fb.group({
    paymentType: ['1'],
  });
  servicesForm = this.fb.group({
    service: ['massivePayment'],
  });
  referencedPaymentForm = this.fb.group({
    referencedPaymentAction: ['register'],
  });
  collectionForm = this.fb.group({
    collectionAction: ['register'],
  });
  domiciliationForm = this.fb.group({
    domiciliationAction: ['register'],
  });
  disabledReferencedActions = ['operation'];
  disabledCollectionActions = ['operation'];
  disabledDomiciliationActions = [];
  referencedPaymentActions = ['register', 'deactivation', 'operation'];
  collectionActions = ['register', 'deactivation', 'modification', 'operation'];
  domiciliationActions = ['register', 'deactivation', 'modification'];
  services = ['massivePayment'];

  constructor(private fb: FormBuilder, public router: Router) {
    super();
  }

  ngOnInit() {
    this.paymentTypeForm.disable({onlySelf: true, emitEvent: false});
    this.operationForm.valueChanges.subscribe(() => {
      this.onChangeFormValues();
    });
    this.paymentTypeForm.valueChanges.subscribe(() => {
      this.onChangeFormValues();
    });
  }

  continue() {
    switch (this.servicesForm.controls.service.value) {
      case 'massivePayment':
        this.router.navigate(['/' + AppConfig.routes.massivePayments.root + '/' + AppConfig.routes.massivePayments.file]);
        break;
      case 'referencedDeposit':
        localStorage.setItem('referencedDepositAction', this.referencedPaymentForm.controls.referencedPaymentAction.value);
        this.router.navigate(['/' + AppConfig.routes.referencedPayment.root]);
        break;
      case 'collection':
        localStorage.setItem('collectionAction', this.collectionForm.controls.collectionAction.value);
        this.router.navigate(['/' + AppConfig.routes.collectionModule.root]);
        break;
      case 'domiciliation':
        localStorage.setItem('domiciliationAction', this.domiciliationForm.controls.domiciliationAction.value);
        this.router.navigate(['/' + AppConfig.routes.domiciliationModule.root]);
        break;
    }
  }

  onChangeFormValues() {
    this.services = [];
    if (this.operationForm.controls.operationType.value === '1') {
      this.paymentTypeForm.controls.paymentType.setValue('1', {emitEvent: false});
    } else if (this.operationForm.controls.operationType.value === '2') {
      this.paymentTypeForm.controls.paymentType.setValue('2', {emitEvent: false});
    }

    if (this.operationForm.controls.operationType.value === '1' && this.paymentTypeForm.controls.paymentType.value === '1') {
      this.services.push('massivePayment');
      this.servicesForm.controls.service.setValue('massivePayment', {emitEvent: false});
    } else if (this.operationForm.controls.operationType.value === '2' && this.paymentTypeForm.controls.paymentType.value === '2') {
      this.services.push('referencedDeposit');
      this.services.push('collection');
      this.services.push('domiciliation');
      this.servicesForm.controls.service.setValue('referencedDeposit', {emitEvent: false});
    }
  }

}
