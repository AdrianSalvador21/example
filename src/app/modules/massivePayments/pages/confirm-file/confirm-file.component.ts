import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatStepper} from '@angular/material';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {MassivePaymentsService} from '../../../../core/services';
import {AppConfig} from '../../../../configs/app.config';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {currentDateWithTime, MODAL_SIZE, scrollToTop} from '../../../../shared/helpers';
import {DecimalPipe} from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'two-confirm-file',
  templateUrl: './confirm-file.component.html',
  styleUrls: ['./confirm-file.component.scss']
})
export class ConfirmFileComponent implements OnInit {

  file;
  loading = false;
  descriptionNameBase: string = 'fileDetail.operator.detail.';
  @Input() onFile;
  @Input() onOperationDetail = false;
  @Input() onAuthDetails: boolean;
  @Input() onModify: boolean;
  @Input() onMassivePayment: boolean;
  @Output() cleanEmmiter = new EventEmitter();

  @Input()
  stepper: MatStepper;

  @Input() showButton: boolean = true;
  operation1: any = [
    {description: 'nameFile', value: ''},
    {description: 'applicationDate', value: ''},
    {description: 'currency', value: ''},
    {description: 'typeCharge', value: ''},
    {description: 'typeFile', value: ''},
    {description: 'amount', value: ''},
    {description: 'totalLines', value: ''},
    {description: 'ownAccounts', value: ''},
    {description: 'thirdSabadell', value: ''},
    {description: 'otherAccountsSPEI', value: ''},
    {description: 'userOperator', value: ''}
    // {description: 'statusBatch', value: ''},
  ];

  constructor(public dialog: MatDialog, private translateService: TranslateService, private massivePaymentsService: MassivePaymentsService, private decimalPipe: DecimalPipe) {
  }

  @Input()
  set fileSelectedInput(value) {
    if (this.file === value)
      return;
    this.file = value;
    if (!this.onOperationDetail && !this.onAuthDetails && !this.onModify) {
      this.operation1.push({description: 'statusBatch', value: ''});
    }

    this.setValues(this.file, this.operation1);

    if (!this.onOperationDetail && !this.onAuthDetails && !this.onModify && !this.onMassivePayment) {
      let date = currentDateWithTime();
      this.operation1.splice(1, 1);
      this.operation1.splice(1, 0, {
        description: this.translateService.instant('massivePayments.detail.operationDate'),
        value: date.format(AppConfig.dateAndTimeFormat)
      });
    }
    if (this.onOperationDetail) {
      let operationDate = '';
      let authDate = '';
      if (this.file.CREATIONDATE !== '') {
        operationDate = moment(this.file.CREATIONDATE, AppConfig.isoDateFormat).format(AppConfig.dateAndTimeFormat);
      }
      if (this.file.AUTHDATE !== '') {
        authDate = moment(this.file.AUTHDATE, AppConfig.isoDateFormat).format(AppConfig.dateAndTimeFormat);
      }

      this.operation1.splice(1, 1);
      this.operation1.splice(1, 0, {
        description: this.translateService.instant('massivePayments.detail.operationDate'),
        value: operationDate
      });
      if (this.file.OPERATIONSTATUS == 'REJECTED') {
        this.operation1.push({description: this.translateService.instant('massivePayments.detail.rejectDate'), value: authDate});
      } else {
        this.operation1.push({description: this.translateService.instant('massivePayments.detail.authDate'), value: authDate});
      }
      this.operation1.push({
        description: this.translateService.instant('massivePayments.detail.statusOperation'),
        value: this.translateService.instant('authorization.operation-status.' + this.file['OPERATIONSTATUS'])
      });
      this.operation1.splice(12, 0, {description: this.translateService.instant('massivePayments.detail.fileFolio'), value: this.file.folio});

      this.operation1.push({
        description: this.translateService.instant('massivePayments.detail.operationFolio'),
        value: this.file.FOLIO
      });

    } else if (this.onAuthDetails) {
      let operationDate = '';
      if (this.file.CREATIONDATE !== '' && this.file.CREATIONDATE !== null) {
        operationDate = moment(this.file.CREATIONDATE, AppConfig.isoDateFormat).format(AppConfig.dateAndTimeFormat);
      }
      this.operation1.splice(1, 1);
      this.operation1.splice(1, 0, {
        description: this.translateService.instant('massivePayments.detail.operationDate'),
        value: operationDate
      });
      let date = currentDateWithTime();
      if (this.stepper['statusAuth'] == 'REJECTED') {
        this.operation1.push({
          description: this.translateService.instant('massivePayments.detail.rejectDate'),
          value: `${date.format(AppConfig.dateAndTimeFormat)}`
        });
      } else {
        this.operation1.push({
          description: this.translateService.instant('massivePayments.detail.authDate'),
          value: `${date.format(AppConfig.dateAndTimeFormat)}`
        });
      }
      this.operation1.push({
        description: this.translateService.instant('massivePayments.detail.statusOperation'),
        value: this.translateService.instant('authorization.operation-status.' + this.stepper['statusAuth'])
      });

      this.operation1.splice(11, 0, {description: this.translateService.instant('massivePayments.detail.fileFolio'), value: this.file.folio});
      this.operation1.push({
        description: this.translateService.instant('massivePayments.detail.operationFolio'),
        value: this.file.FOLIO
      });

    } else if (this.onModify) {
      let operationDate = '';
      if (this.file.CREATIONDATE !== '') {
        operationDate = moment(this.file.CREATIONDATE, AppConfig.isoDateFormat).format(AppConfig.dateAndTimeFormat);
      }

      this.operation1.splice(1, 1);
      this.operation1.splice(1, 0, {
        description: this.translateService.instant('massivePayments.detail.operationDate'),
        value: operationDate
      });
      this.operation1.push({
        description: this.translateService.instant('massivePayments.detail.statusOperation'),
        value: this.translateService.instant('authorization.operation-status.PENDING')
      });

      this.operation1.splice(11, 0, {description: this.translateService.instant('massivePayments.detail.fileFolio'), value: this.file.folio});
      this.operation1.push({
        description: this.translateService.instant('massivePayments.detail.operationFolio'),
        value: this.file.FOLIO
      });

    } else if (this.onMassivePayment) {
      let operationDate = '';
      if (this.file.creationDate !== '') {
        operationDate = moment(this.file.creationDate, AppConfig.isoDateFormat).format(AppConfig.dateAndTimeFormat);
        this.operation1.splice(1, 1);
        this.operation1.splice(1, 0, {
          description: this.translateService.instant('massivePayments.detail.operationDate'),
          value: operationDate
        });
      }
    }
  }

  ngOnInit() {
  }

  reject() {
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    let message = {
      'Header': {
        'Cliente': ''
      },
      'BatchId': this.file.batchId,
      'Folio': this.file.folio,
      'FechaCreacion': moment(this.file.creationDate, AppConfig.isoDateFormat).format(AppConfig.dateFormat),
      'Estado': 'REJECTED',
      'UsuarioAutorizador': sessionData.username
    };
    this.loading = true;
    this.massivePaymentsService.rejectBatch(message).subscribe(response => {
      this.loading = false;
      if (response.errorCode === '0') {
        if (this.onFile) {
          this.cleanEmmiter.emit();
          this.stepper.reset();
        } else {
          this.cleanEmmiter.emit();
          this.stepper.previous();
          scrollToTop();
        }
      } else {
        this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: 'errors.rejectError'}
        });
      }
    }, error => {
      this.loading = false;
    });
  }

  confirm() {
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    this.massivePaymentsService.initOperation({
      operationGroup: 'BATCH',
      operationType: 'BATCH',
      operationData: this.file,
      additionals: '',
      creatorUser: sessionData.username,
      creatorRol: sessionData.role,
      clientID: this.file.client,
      benefAccount: '',
      operationAmount: this.file.amount,
      operationCurrency: this.file.currency
    }).subscribe((response) => {
      let folio = '';
      if (!!response.data) {
        folio = response.data.folio;
      }
      if (response.errorCode === '0') {
        const dialogRef = this.dialog.open(MessageDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {message: 'errors.authorization-required', folio: folio}
        });
        dialogRef.afterClosed().subscribe(result => {
          this.cleanEmmiter.emit();
          this.stepper.reset();
          scrollToTop();
        });
      } else {
        this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: 'errors.genericError'}
        });
      }
    });

  }

  setValues(data: Object, arrayToShow: Array<any>) {
    Object.keys(data).forEach((key) => {
      for (let i = 0; i < arrayToShow.length; i++) {
        if (arrayToShow[i].description == key) {
          if (key === 'statusBatch') {

            arrayToShow[i].value = this.translateService.instant(this.descriptionNameBase + 'statusBatchList.' + data[key]);

          } else if (key === 'typeCharge') {
            arrayToShow[i].value = this.translateService.instant(this.descriptionNameBase + 'chargeType.' + data[key]);
          } else if (['amount'].indexOf(key) > -1) {
            arrayToShow[i].value = this.decimalPipe.transform(data[key], '.2');
          } else {
            arrayToShow[i].value = data[key];
          }

          arrayToShow[i].description = this.translateService.instant(this.descriptionNameBase + key);
        }
      }
    });
  }

  returnPage() {
    this.stepper.previous();
  }

}
