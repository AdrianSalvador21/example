import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatStepper} from '@angular/material';
import {scrollToTop} from '../../../../shared/helpers';
import {TranslateService} from '@ngx-translate/core';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'two-blocked-transactions-detail',
  templateUrl: './blocked-transactions-detail.component.html',
  styleUrls: ['./blocked-transactions-detail.component.scss']
})
export class BlockedTransactionsDetailComponent implements OnInit {
  transactionData;
  descriptionNameBase: string = 'blockedTransactions.list.';
  @Output() onFinalizeOutput = new EventEmitter();
  @Input() stepper: MatStepper;
  transactionDetail: any = [
    {description: 'date', value: ''},
    {description: 'service', value: ''},
    {description: 'amount', value: ''},
    {description: 'name', value: ''},
    {description: 'ordenant', value: ''},
    {description: 'documentType', value: ''},
    {description: 'documentNumber', value: ''},
    {description: 'bank', value: ''},
    {description: 'country', value: ''},
    {description: 'benefType', value: ''},
    {description: 'channel', value: ''},
    {description: 'status', value: ''},
    {description: 'authUser', value: ''},
    {description: 'authDate', value: ''}
  ];

  constructor(private translateService: TranslateService, private decimalPipe: DecimalPipe) {
  }

  @Input()
  set transactionDataInput(value) {
    // this.changeStatusForm.controls.status.setValue('R');
    this.transactionData = value;
    this.setValues(this.transactionData, this.transactionDetail);
    this.transactionDetail.push({description: 'Estado', value: this.stepper['statusTransaction']});
  }

  ngOnInit() {
  }

  onFinalize() {
    this.onFinalizeOutput.emit();
    this.stepper.reset();
    scrollToTop();
  }

  setValues(data: Object, arrayToShow: Array<any>) {
    Object.keys(data).forEach((key) => {
      for (let i = 0; i < arrayToShow.length; i++) {
        if (arrayToShow[i].description == key) {
          if (key === 'typeCharge') {
            if (data[key] === '1') {
              arrayToShow[i].value = 'Global';
            } else {
              arrayToShow[i].value = 'Individual';
            }
          } else if (['amount'].indexOf(key) > -1) {
            arrayToShow[i].value = this.decimalPipe.transform(data[key], '.2');
          } else {
            if (arrayToShow[i].description == 'statusBatch') {
              arrayToShow[i].value = this.translateService.instant('fileQuery.operator.filter.status.' + data[key]);
            } else {
              arrayToShow[i].value = data[key];
            }

          }
          arrayToShow[i].description = this.translateService.instant(this.descriptionNameBase + key);
        }
      }
    });
  }

}
