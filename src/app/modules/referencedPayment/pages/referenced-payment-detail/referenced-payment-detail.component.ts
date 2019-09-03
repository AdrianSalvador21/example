import {Component, Input, OnInit} from '@angular/core';
import {MatStepper} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import {AppConfig} from '../../../../configs/app.config';
import {currentDate, currentDateWithTime} from '../../../../shared/helpers';
import {OperationStatusService} from '../../../../core/services';
import {BaseComponent} from '../../../../shared/components/base/base.component';

@Component({
  selector: 'two-referenced-payment-detail',
  templateUrl: './referenced-payment-detail.component.html',
  styleUrls: ['./referenced-payment-detail.component.scss']
})
export class ReferencedPaymentDetailComponent extends BaseComponent implements OnInit {
  @Input() stepper: MatStepper;
  @Input() errorAccounts = [];
  @Input() onOperationStatus: boolean;
  @Input() onModify: boolean;
  @Input() onAuth: boolean;
  @Input() onHistory = false;

  referencedData;
  descriptionNameBase = 'referencedPayment.detail.';
  accounts;
  showData = false;
  warningMessage = '';
  showWarning = false;

  information: any = [
    {description: 'OPERATIONTYPE', value: ''},
    {description: 'applicationDate', value: ''},
    {description: 'total', value: ''},
    {description: 'OPERATIONUSER', value: ''},
    {description: 'STATUS', value: ''},
    {description: 'FOLIO', value: ''}
  ];

  @Input()
  set dataList(value) {
    this.showData = false;
    if (this.referencedData === value) {
      return;
    }

    this.referencedData = value;
    if (this.stepper['statusAuth'] !== undefined) {
      this.referencedData['STATUS'] = this.stepper['statusAuth'];
    }

    this.accounts = this.referencedData.accounts;
    this.setValues(this.referencedData, this.information);
    this.showData = true;

    if (this.onOperationStatus) {
      this.information.splice(1, 1);
      this.information.splice(1, 0, {description: 'Fecha de operación', value: this.referencedData.CREATIONDATE});

      if (this.referencedData.STATUS == 'REJECTED') {
        this.information.splice(4, 0, {description: 'Fecha de rechazo', value: this.referencedData.AUTHDATE});
        this.showWarning = false;
      } else {
        if (this.referencedData.STATUS == 'PENDING') {
          this.showWarning = this.referencedData.OPERATIONTYPE == 'A';
        } else {
          let duration = moment.duration(currentDateWithTime().diff(moment(`${this.referencedData.applicationDate}`, AppConfig.dateFormat)));
          if (duration.asDays() < 0) {
            this.showWarning = this.referencedData.OPERATIONTYPE == 'A';
          } else {
            this.showWarning = false;
          }
        }
        this.information.splice(4, 0, {description: 'Fecha de autorización', value: this.referencedData.AUTHDATE});
      }
      this.information[6].value = this.referencedData.FOLIO;
    }

    if (this.onModify) {
      this.information.splice(1, 1);
      this.information.splice(1, 0, {description: 'Fecha de operación', value: this.referencedData.CREATIONDATE});
      this.stepper['creationDate'] = this.referencedData.CREATIONDATE;
    } else if (this.onAuth) {
      this.information.splice(1, 1);
      // this.information.splice(1, 0, {description: 'Fecha de operación', value: this.stepper['creationDate']});
      this.information.splice(1, 0, {description: 'Fecha de operación', value: this.referencedData.CREATIONDATE});
      let date = currentDateWithTime();
      if (this.stepper['statusAuth'] == 'REJECTED') {
        this.showWarning = false;
        this.information.splice(4, 0, {description: 'Fecha de rechazo', value: date.format(AppConfig.dateAndTimeFormat)});
      } else {
        this.showWarning = this.referencedData.OPERATIONTYPE == 'A';
        this.information.splice(4, 0, {description: 'Fecha de autorización', value: date.format(AppConfig.dateAndTimeFormat)});
      }
    }
  }

  constructor(private translateService: TranslateService, private operationStatusService: OperationStatusService) {
    super();
  }

  ngOnInit() {
    this.warningMessage = this.translateService.instant('errors.referencedWarning');
  }

  setValues(data: Object, arrayToShow: Array<any>) {
    for (let i = 0; i < arrayToShow.length; i++) {
      const key = arrayToShow[i].description;
      if (key === 'OPERATIONTYPE') {
        arrayToShow[i].value = !!data[key] ? this.translateService.instant('referencedPayment.detail.operationTypes.' + data[key]) : '';
      } else if (key === 'STATUS') {
        arrayToShow[i].value = !!data[key] ? this.translateService.instant('referencedPayment.detail.status.' + data[key]) : '';
      } else if (key === 'folio') {
        arrayToShow[i].value = !!data['additionals'] && !!data['additionals']['folio'] ? data['additionals']['folio'] : data['folio'];
      } else {
        arrayToShow[i].value = !!data[key] ? data[key] : '';
      }
    }

    for (let i = 0; i < arrayToShow.length; i++) {
      arrayToShow[i].description = this.translateService.instant(this.descriptionNameBase + arrayToShow[i].description);
    }
  }
}
