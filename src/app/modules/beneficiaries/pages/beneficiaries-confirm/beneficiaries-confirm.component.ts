import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {MatDialog, MatStepper} from '@angular/material';
import {currentDate, currentDateWithTime, fadeInOut, MODAL_SIZE} from '../../../../shared/helpers/utils.helper';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {DecimalPipe} from '@angular/common';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';
import {AppConfig} from '../../../../configs/app.config';
import * as moment from 'moment';
import {OperationStatusService} from '../../../../core/services';

@Component({
  selector: 'two-beneficiaries-confirm',
  templateUrl: './beneficiaries-confirm.component.html',
  styleUrls: ['./beneficiaries-confirm.component.scss'],
  animations: [fadeInOut]
})
export class BeneficiariesConfirmInternationalComponent extends BaseComponent implements OnInit {

  @Input()
  stepper: MatStepper;
  @Output()
  returnOutput = new EventEmitter();

  @Input() onAuthDetails: boolean;
  @Input() onModify: boolean;
  @Input() onPldDetails: boolean;
  @Input() onHistory: boolean;
  @Input() onOperationDetail: boolean;
  @Input() onBeneficiaryEdition: boolean;
  @Input() hideTitle: boolean;
  @Input() showDialog: boolean;

  showInternational: boolean;
  showIntermediaryBank: boolean = false;
  showDeleteMessage = false;
  beneficiaryInfoData;
  onlyConsult = true;
  status: string = '';
  statusToShow: string = '';
  message: any = 'beneficiary.confirm.dialog.authorizationDialog';
  descriptionNameBase = 'beneficiary.confirm.international.';
  descriptionNameBaseNational = 'beneficiary.confirm.national.';
  descriptionsName = {
    beneficiaries: 'beneficiaries.',
    beneficiaryId: 'beneficiaryId.',
    orderer: 'orderer.',
    beneficiaryInfo: 'beneficiaryInfo.',
    beneficiaryBank: 'beneficiaryBank.',
    intermediaryBank: 'intermediaryBank.',
  };
  beneficiaries2: any = [
    {description: 'clientNumber', value: ''},
    {description: 'beneficiaryAccountNumber', value: ''}
  ];
  beneficiaryId2: any = [
    {description: 'personType', value: ''},
    {description: 'clientNumber', value: ''},
    {description: 'currency', value: ''},
    {description: 'beneficiaryAccountType', value: ''},
    {description: 'beneficiaryAccountNumber', value: ''},
    {description: 'internationalBeneficiary', value: ''}
  ];
  orderer2: any = [
    {description: 'name', value: ''},
    {description: 'address', value: ''},
    {description: 'country', value: ''},
    {description: 'city', value: ''}
  ];
  beneficiaryInfo2: any = [
    {description: 'email', value: ''},
    {description: 'justification', value: ''},
    {description: 'alias', value: ''},
    {description: 'beneficiaryName', value: ''},
    {description: 'beneficiaryCountry', value: ''},
    {description: 'maximumAmount', value: ''},
    {description: 'beneficiaryCity', value: ''},
    {description: 'userIB', value: ''},
    {description: 'beneficiaryAddress', value: ''},
    {description: 'charges', value: ''},
    {description: 'loadDate', value: ''},
    {description: 'loadTime', value: ''},
    {description: 'modificationDate', value: ''},
    {description: 'modificationTime', value: ''}
  ];
  beneficiaryBank2: any = [
    {description: 'bic', value: ''},
    {description: 'beneficiaryBank', value: ''},
    {description: 'country', value: ''},
    {description: 'city', value: ''},
    {description: 'address', value: ''}
  ];
  intermediaryBank2: any = [
    {description: 'intermediaryBankBic', value: ''},
    {description: 'intermediaryBank', value: ''},
    {description: 'beneficiaryAddress', value: ''},
    {description: 'beneficiaryCountry', value: ''},
    {description: 'beneficiaryCity', value: ''}
  ];
  /**NATIONAL DATA**/
  beneficiaryId: any = [
    {description: 'personType', value: ''},
    {description: 'clientNumber', value: ''},
    {description: 'currency', value: ''},
    {description: 'beneficiaryAccountType', value: ''},
    {description: 'beneficiaryAccountNumber', value: ''},
    {description: 'internationalBeneficiary', value: ''},
    {description: 'beneficiaryBank', value: ''}
  ];
  beneficiaryInfo: any = [
    {description: 'justification', value: ''},
    {description: 'alias', value: ''},
    {description: 'legalReference', value: ''},
    {description: 'firstLastName', value: ''},
    {description: 'secondLastName', value: ''},
    {description: 'rfc', value: ''},
    {description: 'curp', value: ''},
    {description: 'userIB', value: ''},
    {description: 'email', value: ''},
    {description: 'phone', value: ''},
    {description: 'maximumAmount', value: ''},
    {description: 'modificationDate', value: ''},
    {description: 'modificationTime', value: ''}
  ];

  constructor(private translateService: TranslateService,
              public router: Router,
              private operationStatusService: OperationStatusService,
              public dialog: MatDialog,
              private decimalPipe: DecimalPipe) {
    super();
  }

  private _data;

  @Input()
  set data(value) {
    if (this._data === value)
      return;
    this._data = value;
    this.showInternational = value.internationalBeneficiary;
    this.status = value.operationType;
    this.beneficiaryInfoData = value;
    if (this.onOperationDetail || this.onAuthDetails) {
      value.FOLIO = this.stepper['listBeneficiary'].FOLIO;
      this.beneficiaryId.push({description: 'FOLIO', value: ''});
    }

    if (this.stepper['deleteMessage'] == 'true') {
      this.showDeleteMessage = true;
    }


    if (this.status == 'M') {
      this.statusToShow = 'Pendiente de modificación';
    } else if (this.status == 'B') {
      this.statusToShow = 'Pendiente de eliminación';
    } else if (this.status == 'R') {
      this.statusToShow = 'En revisión';
    } else if (this.status == 'A') {
      this.statusToShow = 'Habilitado';
    } else if (this.status == 'I') {
      this.statusToShow = 'Inhabilitado';
    } else {
      this.statusToShow = 'En revisión';
    }


    if (this.onAuthDetails) {
      this.statusToShow = this.translateService.instant('authorization.operation-status.' + this.stepper['statusAuth']);
    }
    if (this.showInternational) {
      // international
      this.setValues(value, this.beneficiaries2, this.descriptionsName.beneficiaries, this.status);
      if (this.beneficiaries2[1].description !== 'Alias') {
        this.beneficiaries2.splice(1, 0, {description: 'Alias', value: value.internationalBeneficiaryData.alias});
      }
      this.setValues(value.ordenantData, this.orderer2, this.descriptionsName.orderer, this.status);
      this.setValues(value, this.beneficiaryId2, this.descriptionsName.beneficiaryId, this.status);
      this.setValues(value.beneficiaryBankData, this.beneficiaryBank2, this.descriptionsName.beneficiaryBank, this.status);
      this.setValues(value.internationalBeneficiaryData, this.beneficiaryInfo2, this.descriptionsName.beneficiaryInfo, this.status);
      this.setValues(value.intermediaryBankData, this.intermediaryBank2, this.descriptionsName.intermediaryBank, this.status);

      if (this.onOperationDetail && (this.stepper['benefOperationStatus'] == 'REJECTED' || this.stepper['benefOperationStatus'] == 'AUTHORIZED' || this.stepper['benefOperationStatus'] == 'PENDING')) {

        if (this.stepper['operationType'] == 'M') {
          this.beneficiaryInfo2[12].description = this.translateService.instant('beneficiary.detail.modificationDate');
          this.beneficiaryInfo2[13].description = this.translateService.instant('beneficiary.detail.modificationTime');
        } else {
          this.beneficiaryInfo2[12].description = this.translateService.instant('beneficiary.detail.deleteDate');
          this.beneficiaryInfo2[13].description = this.translateService.instant('beneficiary.detail.deleteTime');
        }
        if (!this.onHistory) {
          this.beneficiaryInfo2.push({
            description: this.translateService.instant('beneficiary.detail.operationStatus'),
            value: this.translateService.instant('authorization.operation-status.' + this.stepper['benefOperationStatus'])
          });
        }
      } else if (this.onAuthDetails) {
        if (value.operationType == 'M') {
          this.beneficiaryInfo2[12].description = this.translateService.instant('beneficiary.detail.modificationDate');
          this.beneficiaryInfo2[13].description = this.translateService.instant('beneficiary.detail.modificationDate');
        } else {
          this.beneficiaryInfo2[12].description = this.translateService.instant('beneficiary.detail.deleteDate');
          this.beneficiaryInfo2[13].description = this.translateService.instant('beneficiary.detail.deleteTime');
        }
        this.beneficiaryInfo2.push({
          description: this.translateService.instant('beneficiary.detail.operationStatus'),
          value: this.statusToShow
        });
      } else if (this.onPldDetails) {
        if (value.onPldChangeStatus == undefined) {
          this.beneficiaryInfo2.push({
            description: this.translateService.instant('beneficiary.detail.status'),
            value: this.translateService.instant('pld.beneficiaries.status.' + value.benefStatus)
          });
        } else {
          this.beneficiaryInfo2.push({
            description: this.translateService.instant('beneficiary.detail.status'),
            value: this.translateService.instant('pld.beneficiaries.status.' + value.onPldChangeStatus)
          });
        }
      } else if (this.onHistory) {
        this.beneficiaryInfo2.push({description: this.translateService.instant('beneficiary.detail.status'), value: this.translateService.instant('history.beneficiariesHistory.list.status.' + value.benefStatus)});
      } else {
        this.beneficiaryInfo2.push({description: this.translateService.instant('beneficiary.detail.status'), value: this.statusToShow});
      }
    } else {
      // national
      this.setValues(value, this.beneficiaryId, this.descriptionsName.beneficiaryId, this.status);
      this.setValues(value.localBeneficiaryData, this.beneficiaryInfo, this.descriptionsName.beneficiaryInfo, this.status);

      if (this.onBeneficiaryEdition && !this.onHistory) {
        this.beneficiaryInfo.splice(12, 1);
        this.beneficiaryInfo.splice(11, 0, {description: 'Fecha de carga', value: `${value.benefCreationDate} ${value.benefCreationTime}`});
        this.beneficiaryInfo[12].description = this.translateService.instant('beneficiary.detail.operationDate');
        this.beneficiaryInfo[12].value = `${value.localBeneficiaryData.modificationDate} ${value.localBeneficiaryData.modificationTime}`;
        this.beneficiaryId.push({description: 'Folio', value: this.stepper['folio']});
      } else if (this.onBeneficiaryEdition && this.onHistory) {
        this.beneficiaryInfo.splice(12, 1);
        this.beneficiaryInfo[11].description = this.translateService.instant('beneficiary.detail.operationDate');
        this.beneficiaryInfo[11].value = `${value.localBeneficiaryData.modificationDate} ${value.localBeneficiaryData.modificationTime}`;
        this.beneficiaryId.push({description: 'Folio', value: this.stepper['folio']});
        this.beneficiaryId.splice(2, 0, {description: 'Nombre o razón social del ordenante', value: value.ordererName});
      }

      if (!!value.ordenantData) {
        this.beneficiaryId.splice(2, 0, {description: 'Nombre o razón social del ordenante', value: value.ordenantData.name});
      }
      this.beneficiaryId.splice(6, 0, {description: 'Tipo de relación', value: ''});
      if (this.onOperationDetail && (this.stepper['benefOperationStatus'] == 'REJECTED' || this.stepper['benefOperationStatus'] == 'AUTHORIZED' || this.stepper['benefOperationStatus'] == 'PENDING')) {
        console.log(this.beneficiaryId);
        console.log(this.beneficiaryInfo);
        if (this.stepper['operationType'] == 'M') {
          this.beneficiaryInfo[11].description = this.translateService.instant('beneficiary.detail.operationProcess');
          this.beneficiaryInfo[11].value = this.translateService.instant('beneficiary.detail.modification');
        } else {
          this.beneficiaryInfo[11].description = this.translateService.instant('beneficiary.detail.operationProcess');
          this.beneficiaryInfo[11].value = this.translateService.instant('beneficiary.detail.elimination');
        }
        this.beneficiaryInfo[12].description = this.translateService.instant('beneficiary.detail.operationDate');
        this.beneficiaryInfo[12].value = moment(this.stepper['creationDate'], AppConfig.isoDateFormat).format(AppConfig.dateAndTimeFormat);

        if (this.stepper['authDate'] == '') {
          this.beneficiaryInfo.push({
            description: this.translateService.instant('beneficiary.detail.authDate'),
            value: ''
          });
        } else {
          this.beneficiaryInfo.push({
            description: this.translateService.instant('beneficiary.detail.authDate'),
            value: moment(this.stepper['authDate'], AppConfig.isoDateFormat).format(AppConfig.dateAndTimeFormat)
          });
        }

        this.beneficiaryInfo.push({
          description: this.translateService.instant('beneficiary.detail.operationStatus'),
          value: this.translateService.instant('authorization.operation-status.' + this.stepper['benefOperationStatus'])
        });
        this.stepper['creationTime'] = moment(this.stepper['creationDate'], AppConfig.isoDateFormat).format(AppConfig.longTimeFormat);
      } else if (this.onAuthDetails && this.onModify) {
        if (this.stepper['operationType'] == 'M') {
          this.beneficiaryInfo[11].description = this.translateService.instant('beneficiary.detail.operationProcess');
          this.beneficiaryInfo[11].value = this.translateService.instant('beneficiary.detail.modification');
        } else {
          this.beneficiaryInfo[11].description = this.translateService.instant('beneficiary.detail.operationProcess');
          this.beneficiaryInfo[11].value = this.translateService.instant('beneficiary.detail.elimination');
        }

        this.beneficiaryInfo[12].description = this.translateService.instant('beneficiary.detail.operationDate');
        this.beneficiaryInfo[12].value = moment(this.stepper['creationDate'], AppConfig.isoDateFormat).format(AppConfig.dateAndTimeFormat);

        this.beneficiaryInfo.push({
          description: this.translateService.instant('beneficiary.detail.operationStatus'),
          value: this.statusToShow
        });
      } else if (this.onAuthDetails && !this.onModify) {
        if (this.stepper['operationType'] == 'M') {
          this.beneficiaryInfo[11].description = this.translateService.instant('beneficiary.detail.operationProcess');
          this.beneficiaryInfo[11].value = this.translateService.instant('beneficiary.detail.modification');
        } else {
          this.beneficiaryInfo[11].description = this.translateService.instant('beneficiary.detail.operationProcess');
          this.beneficiaryInfo[11].value = this.translateService.instant('beneficiary.detail.elimination');
        }

        this.beneficiaryInfo[12].description = this.translateService.instant('beneficiary.detail.operationDate');
        this.beneficiaryInfo[12].value = moment(this.stepper['creationDate'], AppConfig.isoDateFormat).format(AppConfig.dateAndTimeFormat);

        if (this.stepper['statusAuth'] == 'REJECTED') {
          this.beneficiaryInfo.push({
            description: this.translateService.instant('beneficiary.detail.rejectDate'),
            value: currentDateWithTime().format(AppConfig.dateAndTimeFormat)
          });
        } else {
          this.beneficiaryInfo.push({
            description: this.translateService.instant('beneficiary.detail.authDate'),
            value: currentDateWithTime().format(AppConfig.dateAndTimeFormat)
          });
        }
        this.beneficiaryInfo.push({
          description: this.translateService.instant('beneficiary.detail.operationStatus'),
          value: this.statusToShow
        });

      } else if (this.onPldDetails) {
        if (value.onPldChangeStatus === undefined) {
          this.beneficiaryInfo.push({
            description: this.translateService.instant('beneficiary.detail.status'),
            value: this.translateService.instant('pld.beneficiaries.status.' + value.benefStatus)
          });
        } else {
          this.beneficiaryInfo.push({
            description: this.translateService.instant('beneficiary.detail.status'),
            value: this.translateService.instant('pld.beneficiaries.status.' + value.onPldChangeStatus)
          });
        }
      } else if (this.onHistory) {
        this.beneficiaryInfo.push({description: this.translateService.instant('beneficiary.detail.status'), value: this.translateService.instant('history.beneficiariesHistory.list.status.' + value.benefStatus)});
      } else {
        this.beneficiaryInfo.push({description: this.translateService.instant('beneficiary.detail.status'), value: this.statusToShow});
      }
    }
    this.showIntermediaryBank = value.showIntermediaryBank;
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


  return() {
    if (this.showDialog) {
      const dialogRef = this.dialog.open(MessageDialog, {
        width: MODAL_SIZE.width,
        height: MODAL_SIZE.height,
        disableClose: true,
        data: {message: this.message, folio: this.stepper['folio']}
      });
      dialogRef.afterClosed().subscribe((evt) => {
          this.returnOutput.emit();
          this.stepper['deleteMessage'] = undefined;
          this.stepper.selectedIndex = 0;
        }
      );
    } else {
      this.returnOutput.emit();
      this.stepper['deleteMessage'] = undefined;
      this.stepper.selectedIndex = 0;
    }
    return;
  }

  //Assign values
  setValues(data: Object, arrayToShow: Array<any>, rute: string, status: string) {
    if (data == undefined) {
      for (let i = 0; i < arrayToShow.length; i++) {
        if (this.showInternational) {
          arrayToShow[i].description = this.translateService.instant(this.descriptionNameBase + rute + arrayToShow[i].description);
        } else {
          arrayToShow[i].description = this.translateService.instant(this.descriptionNameBaseNational + rute + arrayToShow[i].description);
        }
      }
      return;
    }
    Object.keys(data).forEach((key) => {

      if (key == 'folio' && !this.onOperationDetail) {
        return;
      }

      for (let i = 0; i < arrayToShow.length; i++) {
        if (arrayToShow[i].description == key) {

          // Default date and default hour
          if (key == 'modificationDate') {
            if (data[key] === '' || data[key] == undefined) {
              arrayToShow[i].value = currentDateWithTime().format(AppConfig.dateFormat);
            } else {
              arrayToShow[i].value = data[key];
            }
          } else if (key === 'modificationTime') {
            if (data[key] === '' || data[key] == undefined) {
              arrayToShow[i].value = currentDateWithTime().format(AppConfig.timeFormat);
            } else {
              arrayToShow[i].value = data[key];
            }
          } else if (key === 'personType') {
            arrayToShow[i].value = this.translateService.instant('beneficiary.detail.beneficiary-form.personTypes.' + data[key]);
          } else if (key == 'beneficiaryAccountType') {
            arrayToShow[i].value = this.translateService.instant('beneficiary.detail.beneficiary-form.localAccountTypes.' + data[key]);
          } else if (key == 'internationalBeneficiary') {
            arrayToShow[i].value = this.translateService.instant('beneficiary.detail.beneficiary-form.internationalTypes.' + data[key]);
          } else if (['maximumAmount'].indexOf(key) > -1) {
            try {
              arrayToShow[i].value = this.decimalPipe.transform(data[key], '.2');
            } catch (e) {
              arrayToShow[i].value = '';
            }
          } else {
            arrayToShow[i].value = !!data[key] ? data[key] : '';
          }

          if (this.showInternational) {
            // International label
            if (key == 'modificationDate' || key == 'modificationTime') {
              arrayToShow[i].description = this.translateService.instant(this.descriptionNameBase + 'beneficiaryInfo.' + key + '.' + status);
            } else {
              arrayToShow[i].description = this.translateService.instant(this.descriptionNameBase + rute + key);
            }
          } else {
            // National label
            if (key == 'modificationDate' || key == 'modificationTime') {
              arrayToShow[i].description = this.translateService.instant(this.descriptionNameBaseNational + 'beneficiaryInfo.' + key + '.' + status);
            } else {
              arrayToShow[i].description = this.translateService.instant(this.descriptionNameBaseNational + rute + key);
            }
          }
        }
      }
    });
  }


  returnHistory() {
    this.stepper.reset();
  }


  onDownloadClick() {
    let templateFile = '';
    let fileName = '';
    let data;
    if (this.beneficiaryInfoData.benefType === 'N') {

      if (this.beneficiaryInfoData.operationType === 'A') {
        templateFile = AppConfig.reports['BENEFICIARY-N-Alta'];
      } else {
        templateFile = AppConfig.reports['BENEFICIARY-N'];
      }

      data = {
        IBUser: !!this.beneficiaryInfoData.localBeneficiaryData.userIB ? this.beneficiaryInfoData.localBeneficiaryData.userIB : '',
        OPERATIONTYPE: !!this.beneficiaryInfoData.operationType ? this.beneficiaryInfoData.operationType : '',
        bankName: !!this.beneficiaryInfoData.localBeneficiaryData.benefBank ? this.beneficiaryInfoData.localBeneficiaryData.benefBank : '',
        benefAccountCurrency: !!this.beneficiaryInfoData.currency ? this.beneficiaryInfoData.currency : '',
        benefAccountNumber: !!this.beneficiaryInfoData.beneficiaryAccountNumber ? this.beneficiaryInfoData.beneficiaryAccountNumber : '',
        benefAccountType: !!this.beneficiaryInfoData.beneficiaryAccountType ? this.beneficiaryInfoData.beneficiaryAccountType : '',
        benefAlias: !!this.beneficiaryInfoData.localBeneficiaryData.alias ? this.beneficiaryInfoData.localBeneficiaryData.alias : '',
        benefBank: '044',
        benefCURP: !!this.beneficiaryInfoData.localBeneficiaryData.curp ? this.beneficiaryInfoData.localBeneficiaryData.curp: '',
        benefCreationDate: !!this.beneficiaryInfoData.benefCreationDate ? this.beneficiaryInfoData.benefCreationDate : '',
        benefCreationTime: !!this.beneficiaryInfoData.benefCreationTime ? this.beneficiaryInfoData.benefCreationTime : '',
        benefDocCountry: !!this.beneficiaryInfoData.benefDocCountry ? this.beneficiaryInfoData.benefDocCountry : '',
        benefDocNumber: !!this.beneficiaryInfoData.benefDocNumber ? this.beneficiaryInfoData.benefDocNumber : '',
        benefDocType: !!this.beneficiaryInfoData.benefDocType ? this.beneficiaryInfoData.benefDocType : '',
        benefEmail: !!this.beneficiaryInfoData.localBeneficiaryData.email ? this.beneficiaryInfoData.localBeneficiaryData.email : '',
        benefFolio: '',
        benefJustification: !!this.beneficiaryInfoData.localBeneficiaryData.justification ? this.beneficiaryInfoData.localBeneficiaryData.justification : '',
        benefMaxAmount: this.decimalPipe.transform(this.beneficiaryInfoData.localBeneficiaryData.maximumAmount, '.2'),
        benefModificationDate: !!this.beneficiaryInfoData.benefCreationDate ? this.beneficiaryInfoData.benefCreationDate : '',
        benefModificationTime: !!this.beneficiaryInfoData.benefCreationTime ? this.beneficiaryInfoData.benefCreationTime : '',
        benefName: !!this.beneficiaryInfoData.localBeneficiaryData.legalReference ? this.beneficiaryInfoData.localBeneficiaryData.legalReference : '',
        benefNumber: !!this.beneficiaryInfoData.benefNumber ? this.beneficiaryInfoData.benefNumber : '',
        benefPersonType: !!this.beneficiaryInfoData.personType ? this.beneficiaryInfoData.personType : '',
        benefPhone: !!this.beneficiaryInfoData.localBeneficiaryData.phone ? this.beneficiaryInfoData.localBeneficiaryData.phone : '',
        benefReason: !!this.beneficiaryInfoData.localBeneficiaryData.reason  ? this.beneficiaryInfoData.localBeneficiaryData.reason  :  '',
        benefStatus: this.beneficiaryInfoData.benefStatus,
        benefType: 'N',
        charges: '',
        channel: !!this.beneficiaryInfoData.channel ? this.beneficiaryInfoData.channel : '',
        diaryId: '3',
        firstSurname: !!this.beneficiaryInfoData.localBeneficiaryData.firstLastName ? this.beneficiaryInfoData.localBeneficiaryData.firstLastName : '',
        folio: this.beneficiaryInfoData.FOLIO,
        fullName: this.beneficiaryInfoData.localBeneficiaryData.legalReference + ' ' +
          (!!this.beneficiaryInfoData.localBeneficiaryData.firstLastName ? this.beneficiaryInfoData.localBeneficiaryData.firstLastName : '') + ' ' +
          (!!this.beneficiaryInfoData.localBeneficiaryData.secondLastName ? this.beneficiaryInfoData.localBeneficiaryData.secondLastName : ''),
        operationType: !!this.beneficiaryInfoData.personType ? this.beneficiaryInfoData.personType : '',
        ordererClient: !!this.beneficiaryInfoData.clientNumber ? this.beneficiaryInfoData.clientNumber : '',
        ordererName: !!this.beneficiaryInfoData.ordererName ? this.beneficiaryInfoData.ordererName : '',
        pending_creation: '0',
        pending_modification: '0',
        secondSurname: ''
      };
      data.section = 'onHistory';

      fileName += currentDate().format('YYYYMMDD') + '_';
      if (this.beneficiaryInfoData.operationType === 'B') {
        fileName += 'BJB_';
      } else if (this.beneficiaryInfoData.operationType === 'M') {
        fileName += 'MDB_';
      } else {
        fileName += 'ADB_';
      }
      if (!!this.beneficiaryInfoData.FOLIO) {
        fileName += this.beneficiaryInfoData.FOLIO;
      } else {
        fileName += this.beneficiaryInfoData.clientNumber;
      }
      console.log(this.beneficiaryInfoData);
    } else {
      templateFile = AppConfig.reports['BENEFICIARY-I'];
      data = {
        ordererClient: !!this.beneficiaryInfoData.clientNumber ? this.beneficiaryInfoData.clientNumber : '',
        ordererName: !!this.beneficiaryInfoData.ordenantData.name ? this.beneficiaryInfoData.ordenantData.name : '',
        IBUser: !!this.beneficiaryInfoData.internationalBeneficiaryData.userIB ? this.beneficiaryInfoData.internationalBeneficiaryData.userIB : '',
        benefCreationDate: !!this.beneficiaryInfoData.internationalBeneficiaryData.loadDate ? this.beneficiaryInfoData.internationalBeneficiaryData.loadDate : '',
        benefCreationTime: !!this.beneficiaryInfoData.internationalBeneficiaryData.loadTime ? this.beneficiaryInfoData.internationalBeneficiaryData.loadTime : '',
        benefType: !!this.beneficiaryInfoData.benefType ? this.beneficiaryInfoData.benefType : '',
        benefPersonType: '',
        benefName: !!this.beneficiaryInfoData.internationalBeneficiaryData.beneficiaryName ? this.beneficiaryInfoData.internationalBeneficiaryData.beneficiaryName : '',
        benefAlias: !!this.beneficiaryInfoData.internationalBeneficiaryData.alias ? this.beneficiaryInfoData.internationalBeneficiaryData.alias : '',
        benefAccountNumber: !!this.beneficiaryInfoData.beneficiaryAccountNumber ? this.beneficiaryInfoData.beneficiaryAccountNumber : '',
        benefAccountCurrency: !!this.beneficiaryInfoData.currency ? this.beneficiaryInfoData.currency : '',
        benefBank: '',
        benefBankSwiftCode: '',
        benefCountry: !!this.beneficiaryInfoData.internationalBeneficiaryData.beneficiaryCountry ? this.beneficiaryInfoData.internationalBeneficiaryData.beneficiaryCountry : '',
        benefMaxAmount: this.decimalPipe.transform(this.beneficiaryInfoData.internationalBeneficiaryData.maximumAmount, '.2'),
        benefEmail: !!this.beneficiaryInfoData.internationalBeneficiaryData.email ? this.beneficiaryInfoData.internationalBeneficiaryData.email : '',
        benefModificationDate: !!this.beneficiaryInfoData.internationalBeneficiaryData.loadDate ? this.beneficiaryInfoData.internationalBeneficiaryData.loadDate : '',
        benefModificationTime: !!this.beneficiaryInfoData.internationalBeneficiaryData.loadTime ? this.beneficiaryInfoData.internationalBeneficiaryData.loadTime : '',
        benefReason: '',
        benefStatus: this.beneficiaryInfoData.benefStatus
      };

      fileName += currentDate().format('YYYYMMDD') + '_';
      if (this.beneficiaryInfoData.operationType === 'B') {
        fileName += 'BJB_';
      } else if (this.beneficiaryInfoData.operationType === 'M') {
        fileName += 'MDB_';
      } else {
        fileName += 'ADB_';
      }

      if (!!this.beneficiaryInfoData.FOLIO) {
        fileName += this.beneficiaryInfoData.FOLIO;
      } else {
        fileName += this.beneficiaryInfoData.clientNumber;
      }
      data.section = 'onHistory';
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
