import {Component, OnInit, ViewChild} from '@angular/core';
import {ReferencedPaymentComponent} from '../referenced-payment/referenced-payment.component';

@Component({
  selector: 'two-referenced-payment-wizard',
  templateUrl: './referenced-payment-wizard.component.html',
  styleUrls: ['./referenced-payment-wizard.component.scss']
})
export class ReferencedPaymentWizardComponent implements OnInit {
  @ViewChild('initial') initial: ReferencedPaymentComponent;

  constructor() { }

  ngOnInit() {
  }

  cleanSearch() {
    this.initial.cleanFilter();
  }

}
