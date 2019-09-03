import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatStepper} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'two-referenced-payment-confirm',
  templateUrl: './referenced-payment-confirm.component.html',
  styleUrls: ['./referenced-payment-confirm.component.scss']
})
export class ReferencedPaymentConfirmComponent implements OnInit {
  listData;
  onHigh;
  accountsToShow = [];
  warningMessage = '';

  @Output() initialCleanEmitter = new EventEmitter();

  @Input() stepper: MatStepper;

  @Input()
  set ListData(value) {
    this.accountsToShow = [];
    this.listData = [];
    this.listData = value;
    for (let i = 0; i < this.listData.length; i++) {
      this.accountsToShow.push([this.listData[i]['NUMERO'], this.listData[i]['MONEDA']]);
    }
    this.onHigh = this.stepper['onHigh'];
  }

  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
    this.warningMessage = this.translateService.instant('errors.referencedWarning');
  }

  initialClean() {
    this.initialCleanEmitter.emit();
  }

}
