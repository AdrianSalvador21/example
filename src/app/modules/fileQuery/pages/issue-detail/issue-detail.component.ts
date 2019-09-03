import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog, MatStepper} from '@angular/material';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {AppConfig} from '../../../../configs/app.config';
import {NewOperation} from '../../../../shared/models';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';
import {currentDateWithTime, MODAL_SIZE, scrollToTop} from '../../../../shared/helpers';
import {DecimalPipe} from '@angular/common';
import {AuthorizationService} from '../../../../core/services/authorization.service';
import {ClarificationService, FileQueryService} from '../../../../core/services';
import * as moment from 'moment';

@Component({
  selector: 'two-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss']
})
export class IssueDetailComponent extends BaseComponent implements OnInit {

  @Input()
  stepper: MatStepper;
  showRegularButtons = false;
  showAccounting = false;
  @Input() fileSelected: any;
  @Input() fileLineDetails: boolean;
  @Input() hideIssuesButtons: boolean;
  @Input() fileQueryWizard: boolean;
  @Input() unitQueryLineDetails: boolean;
  @Input() onOperationDetail = false;
  @Input() onAuthDetails: boolean;
  @Input() onModify: boolean;

  @Input() inIssues: boolean;
  @Input() inClarifications: boolean;

  @Input() showDetails: boolean = true;

  @Input() showTrackingList: boolean = false;


  loading: boolean = false;
  accountingData;
  descriptionNameBase: string = 'fileQuery.issues.list.';
  individualValue;
  trackingList;
  unitQueryData;
  @Output() onReturnClick = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() refreshUnit = new EventEmitter();
  initOperationOk = 'fileQuery.issues.initOperationOk';
  initOperationError = 'beneficiary.operator.filter.error.genericError';
  operation1: any = [
    {description: 'paymentItem', value: ''},
    {description: 'intermediaryBank', value: ''},
    {description: 'paymentType', value: ''},
    {description: 'concep', value: ''},
    {description: 'numericReference', value: ''},
    {description: 'status', value: ''},
    {description: 'justification', value: ''}
  ];
  operation2: any = [
    {description: 'ivaAmount', value: ''},
    {description: 'operationDate', value: ''},
    {description: 'cve_rastreo', value: ''},
    {description: 'ordererBank', value: ''},
    {description: 'amount', value: ''},
    {description: 'folio', value: ''}
  ];
  orderer: any = [
    {description: 'ordererAccountType', value: ''},
    {description: 'ordererName', value: ''},
    {description: 'ordererAccount', value: ''},
    {description: 'ordererDocumentNumber', value: ''}
  ];
  beneficiary: any = [
    {description: 'benefAccountType', value: ''},
    {description: 'benefName', value: ''},
    {description: 'benefAccount', value: ''},
    {description: 'benefDocumentNumber', value: ''}
  ];
  operacion1: any = [
    {description: 'paymentItemID', value: ''},
    {description: 'counterpartInstitution', value: ''},
    {description: 'paymentType', value: ''},
    {description: 'concept', value: ''},
    {description: 'reference', value: ''}
  ];
  operacion2: any = [
    {description: 'justification', value: ''},
    {description: 'IVA', value: ''},
    {description: 'applicationDate', value: ''},
    {description: 'trackingKey', value: ''},
    {description: 'bank', value: ''},
    {description: 'amount', value: ''},
    {description: 'folio', value: ''}
  ];
  ordenante: any = [
    {description: 'ordererAccountType', value: ''},
    {description: 'ordererName', value: ''},
    {description: 'ordererAccount', value: ''},
    {description: 'ordererDocument', value: ''}

  ];
  beneficiario: any = [
    {description: 'benefAccountType', value: ''},
    {description: 'benefName', value: ''},
    {description: 'benefAccount', value: ''},
    {description: 'benefDocument', value: ''}
  ];

  _batchLine: any;

  constructor(private translateService: TranslateService, private fileQueryService: FileQueryService, private authorizationService: AuthorizationService, private dialog: MatDialog, private decimalPipe: DecimalPipe, private clarificationService: ClarificationService) {
    super();
  }

  ngOnInit() {
  }

  @Input()
  set issueIndividualData(value) {
    if (this.stepper == undefined || !this.stepper['statusAuth']) {
      this.operacion1.push({description: 'texts', value: ''});
      this.operacion2.shift();
    }
    if (value !== undefined) {
      this.individualValue = value;
      this.individualValue['ordererDocument'] = this.individualValue['ordererRFC'];
      this.individualValue['benefDocument'] = this.individualValue['benefRFC'];
      this.setValues(this.individualValue, this.operacion1);
      this.setValues(this.individualValue, this.operacion2);
      this.setValues(this.individualValue, this.ordenante);
      this.setValues(this.individualValue, this.beneficiario);
    }
    this.operacion2[1].value = value.applicationFullDate;
    if (this.stepper !== undefined && this.stepper['statusAuth']) {
      this.operacion1.push({
        description: this.translateService.instant('fileQuery.issues.operationStatus'),
        value: this.translateService.instant('authorization.operation-status.' + this.stepper['statusAuth'])
      });
    }
  }


  @Input()
  set batchLine(value) {
    if (this._batchLine === value)
      return;
    this._batchLine = value;
    this.loading = true;
    this.getAccounting(value.trackingKey, value.coreReference, value.folio);
    this._batchLine['texts'] = this._batchLine['state'];
    this._batchLine['justification'] = '';
    this._batchLine['trackingKey'] = '';
    this.operacion1.push({description: 'texts', value: ''});
    this.operacion2.pop();
    this.setValues(this._batchLine, this.operacion1);
    this.setValues(this._batchLine, this.operacion2);
    this.setValues(this._batchLine, this.ordenante);
    this.setValues(this._batchLine, this.beneficiario);
    if (!!this._batchLine['fileSelected']) {
      this.operacion2.push({description: 'Folio', value: this._batchLine['fileSelected']['folio']});
    } else {
      if (this.fileQueryWizard) {
        this.operacion2.push({description: this.translateService.instant('fileQuery.issues.folio'), value: this.fileSelected['folio']});
        let field = this.operacion2.shift();
      } else {
        this.operacion2.push({description: 'Folio', value: this._batchLine['folio']});
      }
    }
    if (this.stepper !== undefined && this.stepper['statusAuth']) {
      this.operacion1.pop();
      this.operacion1.push({
        description: this.translateService.instant('fileQuery.issues.operationStatus'),
        value: this.translateService.instant('authorization.operation-status.' + this.stepper['statusAuth'])
      });
    }
  }

  @Input()
  set unitQueryDataInput(value) {
    if (!this.onOperationDetail && !this.onAuthDetails && !this.onModify) {
      this.operacion1.push({description: 'texts', value: ''});
      let field = this.operacion2.shift();
      // this.operacion1.splice(5,0, field);
    }
    if (value !== undefined) {
      this.unitQueryData = value;
      this.loading = true;
      this.getAccounting(this.unitQueryData.trackingKey, this.unitQueryData.coreReference, this.unitQueryData.paymentOrder, true, value.batch);
      this.unitQueryData['ordererDocument'] = this.unitQueryData['ordererRFC'];
      this.unitQueryData['benefDocument'] = this.unitQueryData['benefRFC'];
      this.setValues(this.unitQueryData, this.operacion1);
      this.setValues(this.unitQueryData, this.operacion2);
      this.setValues(this.unitQueryData, this.ordenante);
      this.setValues(this.unitQueryData, this.beneficiario);
    }
    if (!this.onOperationDetail && !this.onAuthDetails && !this.onModify) {
      this.operacion2[1].value += ` ${this.unitQueryData.applicationTime}`;
    }


    if (this.onOperationDetail && (this.stepper['statusAuth'] == 'AUTHORIZED' || this.stepper['statusAuth'] == 'REJECTED' || this.stepper['statusAuth'] == 'PENDING')) {
      this.operacion1.push({
        description: this.translateService.instant('fileQuery.issues.operationStatus'),
        value: this.translateService.instant('authorization.operation-status.' + this.stepper['statusAuth'])
      });
      let operationDate = '';
      let authDate = '';
      if (this.unitQueryData.CREATIONDATE !== '') {
        operationDate = moment(this.unitQueryData.CREATIONDATE, AppConfig.isoDateFormat).format(AppConfig.dateAndTimeFormat);
      }
      if (this.unitQueryData.AUTHDATE !== '') {
        authDate = moment(this.unitQueryData.AUTHDATE, AppConfig.isoDateFormat).format(AppConfig.dateAndTimeFormat);
      }
      this.operacion2.splice(2, 1);
      this.operacion2.splice(2, 0, {description: this.translateService.instant('fileQuery.issues.operationDate'), value: operationDate});
      this.operacion1.splice(5, 0, {description: this.translateService.instant('fileQuery.issues.authDate'), value: authDate});
      this.operacion2.shift();
      this.operacion2.pop();
      this.operacion2.push({description: this.translateService.instant('fileQuery.issues.folio'), value: this.unitQueryData.folio});
      this.operacion2.unshift({description: this.translateService.instant('operation.unitQuery-list.folio-column'), value: this.unitQueryData.FOLIO});
    } else if (this.onAuthDetails && this.onModify) {
      this.operacion1.push({
        description: this.translateService.instant('fileQuery.issues.operationStatus'),
        value: this.translateService.instant('authorization.operation-status.' + this.stepper['statusAuth'])
      });
      let operationDate = '';
      if (this.unitQueryData.CREATIONDATE !== '') {
        operationDate = moment(this.unitQueryData.CREATIONDATE, AppConfig.isoDateFormat).format(AppConfig.dateAndTimeFormat);
      }
      this.operacion2.splice(2, 1);
      this.operacion2.splice(2, 0, {description: this.translateService.instant('fileQuery.issues.operationDate'), value: operationDate});
      this.operacion2.shift();
      this.operacion2[5].value = this.unitQueryData.FOLIO;
    } else if (this.onAuthDetails && !this.onModify) {
      this.operacion1.push({
        description: this.translateService.instant('fileQuery.issues.operationStatus'),
        value: this.translateService.instant('authorization.operation-status.' + this.stepper['statusAuth'])
      });
      let operationDate = '';
      if (this.unitQueryData.CREATIONDATE !== '') {
        operationDate = moment(this.unitQueryData.CREATIONDATE, AppConfig.isoDateFormat).format(AppConfig.dateAndTimeFormat);
      }
      this.operacion2.splice(2, 1);
      this.operacion2.splice(2, 0, {description: this.translateService.instant('fileQuery.issues.operationDate'), value: operationDate});

      let date = currentDateWithTime();
      if (this.stepper['statusAuth'] == 'REJECTED') {
        this.operacion1.splice(5, 0, {
          description: this.translateService.instant('fileQuery.issues.rejectDate'),
          value: `${date.format(AppConfig.dateAndTimeFormat)}`
        });
      } else {
        this.operacion1.splice(5, 0, {
          description: this.translateService.instant('fileQuery.issues.authDate'),
          value: `${date.format(AppConfig.dateAndTimeFormat)}`
        });
      }

      this.operacion2.shift();
      this.operacion2[5].value = this.unitQueryData.FOLIO;
    }


  }

  getAccounting(trackingKey, trackingGroup, identifier, inUnit?: boolean, unitBatch?) {
    this.clarificationService.getAccountingItems(trackingKey, trackingGroup, identifier).subscribe(response => {
      if (response.errorCode !== 0) {
        this.showAccounting = false;
        this.loading = false;
        if (inUnit) {
          this.getTracking(unitBatch);
        }
        return;
      }
      if (response.data.length === 0) {
        this.showAccounting = false;
        this.loading = false;
        if (inUnit) {
          this.getTracking(unitBatch);
        }
        return;
      }
      this.loading = false;
      this.accountingData = response.data;
      this.showAccounting = true;
      if (inUnit) {
        this.getTracking(unitBatch);
      }

    }, error => {
      this.loading = false;
      if (inUnit) {
        this.getTracking(unitBatch);
      }
    });
  }

  getTracking(batchId) {
    this.loading = true;
    this.fileQueryService.trackingItems(batchId, 1).subscribe(response => {
      this.loading = false;
      if (response.errorCode !== '0') {
        const dialogRef = this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: 'errors.genericError'}
        });
        this.showTrackingList = false;
        return;
      }
      if (response.data[0].length === 0) {
        return;
      }
      this.trackingList = response.data[0];
      this.showTrackingList = true;
    }, error => {
      const dialogRef = this.dialog.open(ErrorDialog, {
        width: MODAL_SIZE.width,
        height: MODAL_SIZE.height,
        disableClose: true,
        data: {error: 'errors.genericError'}
      });
      this.loading = false;
    });
  }


  return() {
    this.onReturnClick.emit();
  }

  finalize() {
    this.loading = true;
    let sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    let operObj = <NewOperation> {
      operationGroup: 'FILEQUERY',
      operationType: 'DETAILS',
      operationData: this.fileSelected,
      additionals: this._batchLine,
      creatorUser: sessionData.username,
      creatorRol: sessionData.role,
      clientID: '',
      benefAccount: '',
      operationAmount: -1,
      operationCurrency: ''
    };
    this.authorizationService.initOperation(operObj).subscribe((response) => {
      this.loading = false;
      if (response.errorCode === '0') {
        let folio = '';
        if (!!response.data) {
          folio = response.data.folio;
        }
        const dialogRef = this.dialog.open(MessageDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {message: this.initOperationOk, folio: folio}
        });
        dialogRef.afterClosed().subscribe(result => {
          this.refreshResults();
          this.stepper.reset();
        });
      } else {
        const dialogRef = this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: this.initOperationError}
        });
      }
    });
  }

  unitFinalize() {
    this.loading = true;
    let sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    let operObj = <NewOperation> {
      operationGroup: 'UNITQUERY',
      operationType: 'DETAILS',
      operationData: this.unitQueryData,
      additionals: '',
      creatorUser: sessionData.username,
      creatorRol: sessionData.role,
      clientID: '',
      benefAccount: '',
      operationAmount: -1,
      operationCurrency: ''
    };
    this.authorizationService.initOperation(operObj).subscribe((response) => {
      this.loading = false;
      let folio = '';
      if (!!response.data) {
        folio = response.data.folio;
      }
      if (response.errorCode === '0') {
        const dialogRef = this.dialog.open(MessageDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {message: this.initOperationOk, folio: folio}
        });

        dialogRef.afterClosed().subscribe(result => {
          this.stepper.reset();
          scrollToTop();
          this.refreshUnit.emit();
        });
      } else {
        const dialogRef = this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: this.initOperationError}
        });
      }
    });
  }

  setValues(data: Object, arrayToShow: Array<any>) {
    for (let i = 0; i < arrayToShow.length; i++) {
      if (Object.keys(data).indexOf(arrayToShow[i].description) > -1) {
        const key = arrayToShow[i].description;
        if (key === 'paymentType') {
          if (data[key] === 'C') {
            arrayToShow[i].value = 'Cargo';
          } else {
            arrayToShow[i].value = 'Abono';
          }
        } else if (key === 'ordererAccountType') {
          arrayToShow[i].value = this.translateService.instant(this.descriptionNameBase + key + 's.' + data[key]);
        } else if (key === 'benefAccountType') {
          arrayToShow[i].value = this.translateService.instant(this.descriptionNameBase + key + 's.' + data[key]);
        } else if (['amount', 'IVA'].indexOf(key) > -1) {
          arrayToShow[i].value = this.decimalPipe.transform(data[key], '.2');
        } else if (key === 'texts') {
          arrayToShow[i].value = this.translateService.instant('fileDetail.operator.paymentItems.list.status.' + data[key]);
        } else {
          arrayToShow[i].value = data[key];
        }
      }
      const key = arrayToShow[i].description;
      if (arrayToShow[i].description !== 'IVA') {
        arrayToShow[i].description = this.translateService.instant(this.descriptionNameBase + key);
      } else {
        arrayToShow[i].description = 'IVA';
      }

    }
    Object.keys(data).forEach((key) => {
      if (key === 'lineErrorCode' || key === 'lineErrorDesc' || key === 'total' || key === 'RN') {
        return;
      }
      for (let i = 0; i < arrayToShow.length; i++) {
        if (arrayToShow[i].description == key) {
          if (key === 'paymentType') {
            if (data[key] === 'C') {
              arrayToShow[i].value = 'Cargo';
            } else {
              arrayToShow[i].value = 'Abono';
            }
          } else if (key === 'ordererAccountType') {
            arrayToShow[i].value = this.translateService.instant(this.descriptionNameBase + key + 's.' + data[key]);
          } else if (key === 'benefAccountType') {
            arrayToShow[i].value = this.translateService.instant(this.descriptionNameBase + key + 's.' + data[key]);
          } else if (['amount', 'IVA'].indexOf(key) > -1) {
            arrayToShow[i].value = this.decimalPipe.transform(data[key], '.2');
          } else {
            if (arrayToShow[i].description == 'texts') {
              arrayToShow[i].value = this.translateService.instant('fileDetail.operator.paymentItems.list.status.' + data[key]);
            } else {
              arrayToShow[i].value = data[key];
            }
          }
          if (arrayToShow[i].description !== 'IVA') {
            arrayToShow[i].description = this.translateService.instant(this.descriptionNameBase + key);
          } else {
            arrayToShow[i].description = 'IVA';
          }
        }
      }
    });
  }

  refreshResults() {
    this.refresh.emit();
  }
}
