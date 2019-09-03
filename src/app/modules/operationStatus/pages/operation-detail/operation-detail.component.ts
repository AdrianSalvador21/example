import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatStepper} from '@angular/material';
import {currentDate, scrollToTop} from '../../../../shared/helpers';
import {OperationStatusService} from '../../../../core/services';
import {AppConfig} from '../../../../configs/app.config';
import {DecimalPipe} from '@angular/common';
import {BaseComponent} from '../../../../shared/components/base/base.component';

@Component({
  selector: 'two-operation-detail',
  templateUrl: './operation-detail.component.html',
  styleUrls: ['./operation-detail.component.scss']
})
export class OperationDetailComponent extends BaseComponent implements OnInit {

  @Input()
  stepper: MatStepper;
  @Input()
  detailType: any;
  @Input()
  showDownloadInput: boolean;
  @Output() onReturnEmitter = new EventEmitter();

  fileDetailOne: any = [
    {description: 'file', value: ''},
    {description: 'date', value: ''},
    {description: 'time', value: ''},
    {description: 'currency', value: ''},
    {description: 'operationsVolume', value: ''},
    {description: 'ownAccounts', value: ''},
    {description: 'sabadellAccounts', value: ''},
    {description: 'otherBanksAccounts', value: ''},
    {description: 'amount', value: ''},
    {description: 'status', value: ''},
    {description: 'folio', value: ''},
  ];
  onlyConsult = true;

  constructor(private operationStatusService: OperationStatusService, private decimalPipe: DecimalPipe) {
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

  returnInitial() {
    this.onReturnEmitter.emit();
    this.stepper.previous();
    scrollToTop();
  }

  return() {
    this.stepper.previous();
    scrollToTop();
  }

  confirm() {
    this.stepper.reset();
    scrollToTop();
  }

  onDownloadClick() {
    let templateFile = '';
    let data;
    let fileName = currentDate().format('YYYYMMDD') + '_';
    switch (this.detailType) {

      case 'BENEFICIARY':
        data = {...this.stepper['beneficiaryRaw']};
        data.OPERATIONTYPE = this.stepper['operationType'];
        if (this.stepper['beneficiaryRaw']['OPERATIONSTATUS'] === 'PENDING') {
          return;
        }
        if (this.stepper['beneficiaryRaw']['benefType'] === 'I') {
          templateFile = AppConfig.reports['BENEFICIARY-I'];
        } else {
          templateFile = AppConfig.reports['BENEFICIARY-N'];
          if (data.firstSurname == undefined || data.firstSurname == null) {
            data.firstSurname = '';
          }
          if (data.secondSurname == undefined || data.secondSurname == null) {
            data.secondSurname = '';
          }
          data['fullName'] = `${data.benefName} ${data.firstSurname} ${data.secondSurname}`;
        }
        if (data['OPERATIONTYPE'] === 'B') {
          fileName += 'BJB';
        } else {
          fileName += 'MDB';
        }

        if (data.benefType == 'I') {
          fileName += `I_`;
        } else {
          fileName += `N_`;
        }

        if (data.folio == '') {
          fileName += 'XXXXXXXXXXXXXXXXXXX';
        } else {
          fileName += data.folio;
        }

        const status = this.stepper['benefOperationStatus'];
        if (status == 'REJECTED') {
          data.benefStatus = 'Rechazada';
        } else if (status == 'AUTHORIZED') {
          data.benefStatus = 'Autorizada';
        } else {
          data.benefStatus = 'Pendiente de autorización';
        }
        data.benefAccountNumber = this.clientNumberMask(data.benefAccountNumber);
        try {
          data.benefMaxAmount = this.decimalPipe.transform(data['benefMaxAmount'], '.2');
        } catch {
        }

        data.folio = this.stepper['listBeneficiary'].FOLIO;
        if (data.ordererName == undefined || data.ordererName == null) {
          data['ordererName'] = '';
        }
        if (data.benefDocType.toLowerCase() === 'curp') {
          data.benefDocNumber = '';
        }
        data.benefModificationTime = this.stepper['creationTime'];
        data.section = 'onOperationStatus';
        break;
      case 'BATCH':
        templateFile = AppConfig.reports['BATCH'];
        data = {...this.stepper['batch']};
        fileName += 'DISP_' + data.folio;
        data.Total = data.totalLines;
        try {
          data.amount = this.decimalPipe.transform(data['amount'], '.2');
        }catch{
          console.info('Decimal already formatted');
        }
        break;
      case 'UNITQUERY':
        templateFile = AppConfig.reports['UNITQUERY'];
        data = {...this.stepper['unitQuery']};
        fileName += 'COUN_' + data.folio;
        data.IVA = this.decimalPipe.transform(data['IVA'], '.2');
        // data.IVA = data.IVA === '000000000000.00' ? '0.00' : data.IVA;
        data.ordererAccount = this.clientNumberMask(data.ordererAccount);
        data.benefAccount = this.clientNumberMask(data.benefAccount);
        try {
          data.amount = this.decimalPipe.transform(data['amount'], '.2');
        }catch{
          console.info('Decimal already formatted');
        }
        break;
      case 'FILEQUERY':
        templateFile = AppConfig.reports['FILEQUERY'];
        data = {...this.stepper['fileQuery']};
        fileName += 'CNAR_' + data.folio;
        if (data.OPERATIONSTATUS === 'AUTHORIZED') {
          data.status = 'Autorizada';
        } else if (data.OPERATIONSTATUS === 'REJECTED') {
          data.status = 'Rechazada';
        } else {
          data.status = 'Pendiente de autorización';
        }
        try {
          data.amount = this.decimalPipe.transform(data['amount'], '.2');
        }catch{
          console.info('Decimal already formatted');
        }
        break;
      case 'REFERENCEDDEPOSIT':
        templateFile = AppConfig.reports['REFERENCEDDEPOSIT'];
        data = {...this.stepper['dataReferencedSelected']};
        let accountsString = '';
        for (let i = 0; i < data.accounts.length; i++) {
          accountsString += `${this.clientNumberMask(data.accounts[i].NUMERO)},`;
        }
        accountsString = accountsString.toString();
        data.accountsString = accountsString;
        // data.accounts = JSON.stringify(data.accounts);
        data.total = data.total.toString();
        data['clientName'] = !data['clientName'] ? '' : data['clientName'];
        fileName += data.OPERATIONTYPE === 'B' ? 'BJDR_' : 'ALDR_';
        if (data.folio !== '') {
          fileName += data.folio;
        } else {
          fileName += 'XXXXXXXXXXXXXXXXXXX';
        }

        data.applicationTime = data.OPERATIONTYPE === 'A' ? '' : data.applicationTime;
        break;
    }
    this.operationStatusService.generateBase64Report(AppConfig.paths.reports + templateFile, fileName, 'INLINE', data, 'application/pdf').subscribe(response => {
      if (window.navigator.msSaveOrOpenBlob) {
        // msSaveBlob only available for IE & Edge
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
