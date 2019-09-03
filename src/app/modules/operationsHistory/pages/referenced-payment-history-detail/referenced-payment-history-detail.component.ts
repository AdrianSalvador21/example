import {Component, Input, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {MatStepper} from '@angular/material';
import {AppConfig} from '../../../../configs/app.config';
import {OperationStatusService} from '../../../../core/services';
import {TranslateService} from '@ngx-translate/core';
import * as moment from '../../../referencedPayment/pages/referenced-payment-detail/referenced-payment-detail.component';
import {currentDate, currentDateWithTime} from '../../../../shared/helpers';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'two-referenced-payment-history-detail',
  templateUrl: './referenced-payment-history-detail.component.html',
  styleUrls: ['./referenced-payment-history-detail.component.scss']
})
export class ReferencedPaymentHistoryDetailComponent extends BaseComponent implements OnInit {
  @Input() stepper: MatStepper;

  referencedData;
  descriptionNameBase: string = 'referencedPayment.detail.';
  accounts = [];
  showData = false;
  onlyConsult = true;

  historyInformation: any = [
    {description: 'channel', value: ''},
    {description: 'FOLIO', value: ''},
    {description: 'applicationDate', value: ''},
    {description: 'clientID', value: ''},
    {description: 'name', value: ''},
    {description: 'OPERATIONUSER', value: ''},
    {description: 'authUser', value: ''},
    {description: 'OPERATIONTYPE', value: ''}
  ];


  @Input()
  set dataList(value) {
    this.showData = false;
    if (this.referencedData === value) {
      return;
    }
    this.referencedData = value;
    this.accounts = this.referencedData.accounts;
    this.accounts.forEach((element) => {
      element['NUMERO'] = element['CUENTA'];
    });
    if (this.stepper['statusAuth'] !== undefined) {
      this.referencedData['STATUS'] = this.stepper['statusAuth'];
    }
    this.setValues(this.referencedData, this.historyInformation);
    this.showData = true;
  }

  constructor(private translateService: TranslateService, private operationStatusService: OperationStatusService) {
    super();
  }

  ngOnInit() {
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    let roles = (<string>sessionData.role).split(',');
    roles.forEach((rol) => {
      if (rol !== 'CONSULTIVE') {
        this.onlyConsult = false;
      }
    });
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



  onReceiptClick() {
    let status = this.translateService.instant('history.referencedPaymentHistory.list.statusOptions.' + this.referencedData.OPERATIONTYPE);
    // `${this.clientNumberMask(this.referencedData.accounts[0].NUMERO)},`
    let accountsData = '';
    this.accounts.forEach((account, index) => {
      accountsData += `${this.clientNumberMask(account.NUMERO)},`;
    });
    let data = {
      AUTHDATE: '',
      AUTHUSER: '',
      CREATIONDATE: this.referencedData.operationDate,
      FOLIO: this.referencedData.FOLIO,
      OPERATIONID: '',
      OPERATIONSTATUS: 'AUTHORIZED',
      OPERATIONTYPE: this.referencedData.OPERATIONTYPE,
      OPERATIONUSER: this.referencedData.OPERATIONUSER,
      STATUS: status,
      accounts: '',
      accountsString: accountsData,
      additionals: {channel: 'ADAPTOR'},
      applicationDate: this.referencedData.applicationDate,
      applicationTime: '',
      authDate: this.referencedData.authDate,
      authTime: '',
      channel: '',
      clientID: this.referencedData.clientID,
      folio: this.referencedData.FOLIO,
      operationDate: this.referencedData.operationDate,
      operationTime: '',
      total: '1',
      clientName: this.referencedData.clientName
    };
    const templateFile = AppConfig.reports['REFERENCEDDEPOSIT'];
    let fileName = '';
    if (data.OPERATIONTYPE == 'B') {
      fileName += 'BJDR_';
    } else {
      fileName += 'ALDR_';
    }
    if (data.folio !== '') {
      fileName += data.folio;
    } else {
      fileName += 'XXXXXXXXXXXXXXXXXXX';
    }
    this.operationStatusService.generateBase64Report(AppConfig.paths.reports + templateFile,
      fileName, 'INLINE',
      data,
      'application/pdf').subscribe(response => {
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(response, fileName + '.pdf');
      } else {
        const fileURL = URL.createObjectURL(response);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a['href'] = fileURL;
        a['download'] = fileName;
        a.click();
        URL.revokeObjectURL(fileURL);
        a.remove();
      }
    });
  }

  onRequestClick() {
    let data;
    let fileName = '';
    let templateFile = '';
    let accountsLength;

    if (this.referencedData.OPERATIONTYPE === 'B' || this.accounts.length <= 1) {
      data = {
        operationDate: this.referencedData.operationDate,
        operationType: this.referencedData.OPERATIONTYPE,
        accountsString: '',
        clientNumber: this.referencedData.clientID,
        clientName: this.referencedData.clientName
      };

      this.accounts.forEach((account, index) => {
        if (index === this.accounts.length - 1) {
          data.accountsString += `${this.clientNumberMask(account.NUMERO)}`;
        } else {
          data.accountsString += `${this.clientNumberMask(account.NUMERO)},`;
        }
      });
      templateFile = AppConfig.reports.HISTORYDETAIL;
      fileName = data.operationType === 'A' ? currentDate().format('YYYYMMDD') + '_' + 'SADR_' + this.referencedData.FOLIO : currentDate().format('YYYYMMDD') + '_' + 'SBDR_' + this.referencedData.FOLIO;

    } else {
      data = {
        operationDate: this.referencedData.operationDate,
        operationType: this.referencedData.OPERATIONTYPE,
        accountList1: [],
        accountList2: [],
        clientNumber: this.referencedData.clientID,
        clientName: this.referencedData.clientName
      };
      templateFile = AppConfig.reports.REQUESTDEPOSIT;
      fileName = data.operationType === 'A' ? currentDate().format('YYYYMMDD') + '_' + 'SADR_' + this.referencedData.FOLIO : currentDate().format('YYYYMMDD') + '_' + 'SBDR_' + this.referencedData.FOLIO;

      this.accounts.forEach((account, index) => {
        if ((index + 1) % 2 !== 0) {
          data.accountList1.push({account: this.clientNumberMask(account.CUENTA)});
        } else {
          data.accountList2.push({account: this.clientNumberMask(account.CUENTA)});
        }
      });
    }
    this.operationStatusService.generateBase64Report(AppConfig.paths.reports + templateFile,
      fileName, 'INLINE',
      data,
      'application/pdf').subscribe(response => {
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(response, fileName + '.pdf');
      } else {
        const fileURL = URL.createObjectURL(response);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a['href'] = fileURL;
        a['download'] = fileName;
        a.click();
        URL.revokeObjectURL(fileURL);
        a.remove();
      }
    });
  }

}
