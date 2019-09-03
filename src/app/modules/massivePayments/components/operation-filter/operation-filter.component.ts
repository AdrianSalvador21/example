import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatDialog, MatStepper} from '@angular/material';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {MODAL_SIZE, scrollToTop} from '../../../../shared/helpers';
import {Router} from '@angular/router';
import {AppConfig} from '../../../../configs/app.config';

@Component({
  selector: 'two-operation-filter',
  templateUrl: './operation-filter.component.html',
  styleUrls: ['./operation-filter.component.scss']
})
export class OperationFilterComponent implements OnInit {
  @Input() stepper: MatStepper;
  notImplemented = 'errors.not-implemented';
  operationForm = this.fb.group({
    operationType: ['1'],
  });
  paymentTypeForm = this.fb.group({
    paymentType: ['1'],
  });
  servicesForm = this.fb.group({
    service: ['massivePayment'],
  });
  services = ['massivePayment'];

  constructor(private fb: FormBuilder, private dialog: MatDialog, public router: Router) {
    this.paymentTypeForm.disable({onlySelf: true, emitEvent: false});
  }

  ngOnInit() {
    this.operationForm.valueChanges.subscribe(() => {
      this.validChanges();
    });
    this.paymentTypeForm.valueChanges.subscribe(() => {
      this.validChanges();
    });
  }

  continue() {
    switch (this.servicesForm.controls.service.value) {
      case 'massivePayment':
        if (this.paymentTypeForm.value.paymentType === '1' && this.servicesForm.value.service === 'massivePayment') {
          this.stepper.next();
          scrollToTop();
        } else {
          this.dialog.open(ErrorDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {error: this.notImplemented}
          });
        }
        break;
      case 'referencedDeposit':
        this.router.navigate(['/' + AppConfig.routes.referencedPayment.root]);
        break;
    }
  }

  validChanges() {
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
      this.servicesForm.controls.service.setValue('referencedDeposit', {emitEvent: false});
    }
  }
}
