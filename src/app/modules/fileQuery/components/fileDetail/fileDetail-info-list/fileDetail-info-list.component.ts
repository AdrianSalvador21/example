import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {BaseComponent} from '../../../../../shared/components/base/base.component';
import {DecimalPipe} from '@angular/common';
import {MatStepper} from '@angular/material';
import {currentDateWithTime} from '../../../../../shared/helpers';
import {AppConfig} from '../../../../../configs/app.config';
import * as moment from 'moment';


@Component({
  selector: 'two-file-detail-info-list',
  templateUrl: './fileDetail-info-list.component.html',
  styleUrls: ['./fileDetail-info-list.component.scss']
})

export class FileDetailInfoListComponent extends BaseComponent implements OnInit {
  @Input() onOperationStatus: boolean;
  @Input() onModify: boolean;
  @Input() onAuthOperation: boolean;

  file;

  descriptionNameBase: string = 'fileDetail.operator.detail.';
  @Input() stepper: MatStepper;
  fileDetailOne: any = [
    {description: 'ordererName', value: ''},
    {description: 'nameFile', value: ''},
    {description: 'folio', value: ''},
    {description: 'amount', value: ''},
    {description: 'ownAccounts', value: ''},
    {description: 'thirdSabadell', value: ''},
    {description: 'otherAccountsSPEI', value: ''},
  ];
  fileDetailTwo: any = [
    {description: 'applicationDateTo', value: ''},
    {description: 'typeCharge', value: ''},
    {description: 'typeFile', value: ''},
    {description: 'userOperator', value: ''},
    {description: 'authorizingUser', value: ''},
    {description: 'channel', value: ''}
    // {description: 'statusBatch', value: ''},
  ];

  constructor(private translateService: TranslateService, private decimalPipe: DecimalPipe) {
    super();
  }

  @Input()
  set fileSelectedInput(value) {
    if (this.file === value)
      return;
    this.file = value;


    this.setValues(this.file, this.fileDetailOne);
    this.setValues(this.file, this.fileDetailTwo);

    if (this.stepper == undefined || !this.stepper['statusAuth']) {
      if (this.file.OPERATIONSTATUS !== undefined) {
        this.fileDetailTwo.push({
          description: this.translateService.instant('fileDetail.operator.operation-status'),
          value: this.translateService.instant('authorization.operation-status.' + this.file['OPERATIONSTATUS'])
        });
      } else {
        // status batch
        this.fileDetailTwo.push({
          description: this.translateService.instant('fileDetail.operator.file-status'),
          value: this.translateService.instant('fileQuery.operator.filter.status.' + this.file['statusBatch'])
        });
      }
    }

    if (this.stepper !== undefined && this.stepper['statusAuth']) {
      this.fileDetailTwo.push({
        description: this.translateService.instant('fileDetail.operator.operation-status'),
        value: this.translateService.instant('authorization.operation-status.' + this.stepper['statusAuth'])
      });
    }

    if (this.onOperationStatus) {
      this.fileDetailOne.splice(3, 0, {description: this.translateService.instant('fileDetail.operator.file-status'), value: this.translateService.instant('fileDetail.operator.paymentItems.list.status.' +  this.file.statusBatch)});

      let operationDate = '';
      let authDate = '';
      if (this.file.CREATIONDATE !== '') {
        operationDate = moment(this.file.CREATIONDATE, AppConfig.isoDateFormat).format(AppConfig.dateAndTimeFormat);
      }
      if (this.file.AUTHDATE !== '') {
        authDate = moment(this.file.AUTHDATE, AppConfig.isoDateFormat).format(AppConfig.dateAndTimeFormat);
      }
      this.fileDetailTwo.shift();
      this.fileDetailOne.push({description: this.translateService.instant('fileDetail.operator.operation-date'), value: operationDate});
      if (this.file.OPERATIONSTATUS == 'REJECTED') {
        this.fileDetailTwo.splice(5, 0, {description: this.translateService.instant('fileDetail.operator.reject-date'), value: authDate});
      } else {
        this.fileDetailTwo.splice(5, 0, {description: this.translateService.instant('fileDetail.operator.auth-date'), value: authDate});
      }

      this.fileDetailTwo[2].value = this.file.CREATORUSER;
      this.fileDetailTwo[3].value = this.file.AUTHUSER;
      this.fileDetailOne[2].value = this.file.folio;
      this.fileDetailTwo.push({description: this.translateService.instant('fileDetail.operator.operation-folio'), value: this.file.FOLIO});
    } else if (this.onModify) {
      this.fileDetailOne.splice(3, 0, {description: this.translateService.instant('fileDetail.operator.file-status'), value: this.translateService.instant('fileDetail.operator.paymentItems.list.status.' +  this.file.statusBatch)});
      this.fileDetailTwo[3].value = this.file.CREATORUSER;
      this.fileDetailTwo[4].value = '';
      let operationDate = '';
      if (this.file.CREATIONDATE !== '') {
        operationDate = moment(this.file.CREATIONDATE, AppConfig.isoDateFormat).format(AppConfig.dateAndTimeFormat);
      }
      this.fileDetailTwo.shift();
      this.fileDetailTwo.unshift({description: this.translateService.instant('fileDetail.operator.operation-date'), value: operationDate});

      this.fileDetailOne[2].value = this.file.folio;
      this.fileDetailTwo.push({description: this.translateService.instant('fileDetail.operator.operation-folio'), value: this.file.FOLIO});

    } else if (this.onAuthOperation && !this.onModify) {
      this.fileDetailOne.splice(3, 0, {description: this.translateService.instant('fileDetail.operator.file-status'), value: this.translateService.instant('fileDetail.operator.paymentItems.list.status.' +  this.file.statusBatch)});
      const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
      this.fileDetailTwo[3].value = this.file.CREATORUSER;
      this.fileDetailTwo[4].value = sessionData.username;
      let operationDate = '';
      if (this.file.CREATIONDATE !== '') {
        operationDate = moment(this.file.CREATIONDATE, AppConfig.isoDateFormat).format(AppConfig.dateAndTimeFormat);
      }
      this.fileDetailTwo.shift();
      this.fileDetailOne.push({description: this.translateService.instant('fileDetail.operator.operation-date'), value: operationDate});
      if (this.stepper['statusAuth'] == 'REJECTED') {
        const date = currentDateWithTime();
        this.fileDetailTwo.splice(5, 0, {description: this.translateService.instant('fileDetail.operator.reject-date'), value: `${date.format(AppConfig.dateAndTimeFormat)}`});
      } else {
        const date = currentDateWithTime();
        this.fileDetailTwo.splice(5, 0, {description: this.translateService.instant('fileDetail.operator.auth-date'), value: `${date.format(AppConfig.dateAndTimeFormat)}`});
      }

      this.fileDetailOne[2].value = this.file.folio;
      this.fileDetailTwo.push({description: this.translateService.instant('fileDetail.operator.operation-folio'), value: this.file.FOLIO});
    }
  }

  ngOnInit() {
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
            } else if (arrayToShow[i].description == 'applicationDateTo') {
              let date = '';
              if (data[key] !== '') {
                date = moment(data[key], AppConfig.isoDateFormat).format(AppConfig.dateAndTimeFormat);
              }
              arrayToShow[i].value = date;
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
