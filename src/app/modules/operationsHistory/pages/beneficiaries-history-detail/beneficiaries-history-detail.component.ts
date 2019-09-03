import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatStepper} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {DecimalPipe} from '@angular/common';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import * as moment from 'moment';
import {AppConfig} from '../../../../configs/app.config';
import {currentDateWithTime} from '../../../../shared/helpers';

@Component({
  selector: 'two-beneficiaries-history-detail',
  templateUrl: './beneficiaries-history-detail.component.html',
  styleUrls: ['./beneficiaries-history-detail.component.scss']
})
export class BeneficiariesHistoryDetailComponent extends BaseComponent implements OnInit {
  @Input()
  stepper: MatStepper;
  @Output()
  returnOutput = new EventEmitter();

  @Input() onAuthDetails: boolean;
  @Input() onModify: boolean;
  @Input() onPldDetails: boolean;
  @Input() onOperationDetail: boolean;
  @Input() onBeneficiaryEdition: boolean;
  @Input() hideTitle: boolean;
  @Input() showDialog: boolean;

  showInternational: boolean;
  showIntermediaryBank: boolean = false;
  showDeleteMessage = false;

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

  private _data;

  constructor(private translateService: TranslateService,
              public router: Router,
              public dialog: MatDialog,
              private decimalPipe: DecimalPipe) {
    super();
  }

  ngOnInit() {
  }


  @Input()
  set data(value) {
    if (this._data === value)
      return;
    this._data = value;
    this.showInternational = value.internationalBeneficiary;
    this.status = value.operationType;

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

      // national
      this.setValues(value, this.beneficiaryId, this.descriptionsName.beneficiaryId, this.status);
      this.setValues(value.localBeneficiaryData, this.beneficiaryInfo, this.descriptionsName.beneficiaryInfo, this.status);

      if (this.onBeneficiaryEdition) {
        this.beneficiaryInfo.splice(12, 1);
        this.beneficiaryInfo.splice(11, 0, {description: 'Fecha de carga', value: `${value.benefCreationDate} ${value.benefCreationTime}`});
        this.beneficiaryInfo[12].description = this.translateService.instant('beneficiary.detail.operationDate');
        this.beneficiaryInfo[12].value = `${value.localBeneficiaryData.modificationDate} ${value.localBeneficiaryData.modificationTime}`;
        this.beneficiaryId.push({description: 'Folio', value: this.stepper['folio']});
      }

      if (!!value.ordenantData) {
        this.beneficiaryId.splice(2, 0, {description: 'Nombre o razón social del ordenante', value: value.ordenantData.name});
      }
      this.beneficiaryInfo.push({description: this.translateService.instant('beneficiary.detail.status'), value: this.statusToShow});
    this.showIntermediaryBank = value.showIntermediaryBank;
  }

  // Assign values
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
            if (data[key] == '' || data[key] == undefined) {
              let dateToShow = currentDateWithTime().format(AppConfig.dateFormat);
              arrayToShow[i].value = dateToShow;
            } else {
              arrayToShow[i].value = data[key];
            }
          } else if (key == 'modificationTime') {
            if (data[key] == '' || data[key] == undefined) {
              let hourToShow = currentDateWithTime().format(AppConfig.timeFormat);
              arrayToShow[i].value = hourToShow;
            } else {
              arrayToShow[i].value = data[key];
            }
          } else if (key == 'personType') {
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




}
