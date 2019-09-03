import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {fadeInOut, MODAL_SIZE} from '../../../../shared/helpers/utils.helper';
import {Beneficiary, Profile} from '../../../../shared/models';
import {MatDialog, MatStepper} from '@angular/material';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {BeneficiaryOperatorFilterComponent} from '../../components/beneficiary-operator-filter';
import {BeneficiaryService} from '../../../../core/services';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import {AppConfig} from '../../../../configs/app.config';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';

@Component({
  selector: 'two-beneficiaries-edition',
  templateUrl: './beneficiaries-edition-page.component.html',
  styleUrls: ['./beneficiaries-edition-page.component.scss'],
  animations: [fadeInOut]
})

export class BeneficiariesEditionPageComponent extends BaseComponent implements OnInit {
  @ViewChild('filter') filter: BeneficiaryOperatorFilterComponent;

  @Input()
  stepper: MatStepper;

  beneficiary: Beneficiary;
  beneficiaryRaw: any;
  role;
  firstStepper: boolean = true;
  showData = false;
  loading = false;
  internationalBeneficiary = false;
  warningMessage = '';
  showWarning = false;

  constructor(private beneficiaryService: BeneficiaryService, private translateService: TranslateService, public dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
  }

  setBeneficiary(benef: any) {
    this.internationalBeneficiary = false;
    this.showWarning = false;
    this.warningMessage = '';
    if (benef !== undefined) {
      this.showData = false;
      this.loading = true;
      this.beneficiaryRaw = benef.data[0][0];
      this.beneficiary = this.beneficiaryService.mapGetBeneficiary(benef);
      if (this.beneficiary.internationalBeneficiary) {
        this.beneficiaryRaw.benefAlias = !!this.beneficiaryRaw.benefAlias ? this.beneficiaryRaw.benefAlias : '';
        this.beneficiaryRaw.benefEmail = !!this.beneficiaryRaw.benefEmail ? this.beneficiaryRaw.benefEmail : '';
        this.beneficiaryRaw.benefJustification = !!this.beneficiaryRaw.benefJustification ? this.beneficiaryRaw.benefJustification : '';
        this.beneficiaryRaw.benefMaxAmount = !!this.beneficiaryRaw.benefMaxAmount ? this.beneficiaryRaw.benefMaxAmount : '';
        this.beneficiaryRaw.benefName = !!this.beneficiaryRaw.benefName ? this.beneficiaryRaw.benefName : '';
      } else {
        this.beneficiaryRaw.benefAlias = !!this.beneficiaryRaw.benefAlias ? this.beneficiaryRaw.benefAlias : '';
        this.beneficiaryRaw.benefPhone = !!this.beneficiaryRaw.benefPhone ? this.beneficiaryRaw.benefPhone : '';
        this.beneficiaryRaw.benefEmail = !!this.beneficiaryRaw.benefEmail ? this.beneficiaryRaw.benefEmail : '';
        this.beneficiaryRaw.benefCURP = !!this.beneficiaryRaw.benefCURP ? this.beneficiaryRaw.benefCURP : '';
        this.beneficiaryRaw.benefDocNumber = !!this.beneficiaryRaw.benefDocNumber ? this.beneficiaryRaw.benefDocNumber : '';
        this.beneficiaryRaw.benefJustification = !!this.beneficiaryRaw.benefJustification ? this.beneficiaryRaw.benefJustification : '';
        this.beneficiaryRaw.benefMaxAmount = !!this.beneficiaryRaw.benefMaxAmount ? this.beneficiaryRaw.benefMaxAmount : '';
        this.beneficiaryRaw.benefName = !!this.beneficiaryRaw.benefName ? this.beneficiaryRaw.benefName : '';
      }
      if (this.beneficiary.internationalBeneficiary) {
        this.internationalBeneficiary = true;
      } else {
        this.internationalBeneficiary = false;
      }

      this.beneficiaryService.getBeneficiaryDetail(this.beneficiary.clientNumber).subscribe(response => {
        let ordenantResponse = JSON.parse(response.data);
        if (this.beneficiary.internationalBeneficiary) {

          this.beneficiary.ordenantData.address = `${ordenantResponse['CALLE']} ${ordenantResponse['NRO_PUERTA']}`;
          if (ordenantResponse.APARTAMENTO !== '') {
            this.beneficiary.ordenantData.address += ', ';
            this.beneficiary.ordenantData.address += ordenantResponse['APARTAMENTO'];
          }
          if (ordenantResponse.BARRIO !== '') {
            this.beneficiary.ordenantData.address += ', ';
            this.beneficiary.ordenantData.address += ordenantResponse['BARRIO'];
          }
          if (ordenantResponse.CODIGO_POSTAL !== '') {
            this.beneficiary.ordenantData.address += ', ';
            this.beneficiary.ordenantData.address += `C.P. ${ordenantResponse['CODIGO_POSTAL']}`;
          }
          this.beneficiary.ordenantData.city = `${ordenantResponse['LOCALIDAD']}, ${ordenantResponse['CIUDAD']}`;
          this.beneficiary.ordenantData.country = `${ordenantResponse['PAIS']}`;
          this.beneficiary.ordenantData.name = `${ordenantResponse['NOMBRE']}`;

          /*if (this.beneficiary.internationalBeneficiaryData.pendingCreation == '1') {
            let time = moment(this.beneficiary.internationalBeneficiaryData.modificationTime, AppConfig.longTimeFormat).add(30, 'minutes');
            this.warningMessage = this.translateService.instant('errors.creationWarning');
            this.warningMessage += `${time.format(AppConfig.timeFormat)}`;
            this.showWarning = true;
          } else if (this.beneficiary.internationalBeneficiaryData.pendingModification == '1') {
            this.warningMessage = this.translateService.instant('errors.modificationWarning');
            this.showWarning = true;
            let time = moment(this.beneficiary.internationalBeneficiaryData.modificationTime, AppConfig.longTimeFormat).add(30, 'minutes');
            this.warningMessage += `${time.format(AppConfig.timeFormat)}`;
          } else {
            this.showWarning = false;
          }*/
          this.showData = true;
          this.loading = false;
        } else {
          this.beneficiary['ordenantData'] = {
            address: '',
            city: '',
            country: '',
            name: ''
          };
          this.beneficiary['ordenantData']['address'] = `${ordenantResponse['CALLE']} ${ordenantResponse['NRO_PUERTA']}`;
          if (ordenantResponse.APARTAMENTO !== '') {
            this.beneficiary['ordenantData']['address'] += ', ';
            this.beneficiary['ordenantData']['address'] += ordenantResponse['APARTAMENTO'];
          }
          if (ordenantResponse.BARRIO !== '') {
            this.beneficiary['ordenantData']['address'] += ', ';
            this.beneficiary['ordenantData']['address'] += ordenantResponse['BARRIO'];
          }
          if (ordenantResponse.CODIGO_POSTAL !== '') {
            this.beneficiary['ordenantData']['address'] += ', ';
            this.beneficiary['ordenantData']['address'] += `C.P. ${ordenantResponse['CODIGO_POSTAL']}`;
          }
          this.beneficiary['ordenantData']['city'] = `${ordenantResponse['LOCALIDAD']}, ${ordenantResponse['CIUDAD']}`;
          this.beneficiary['ordenantData']['country'] = `${ordenantResponse['PAIS']}`;
          this.beneficiary['ordenantData']['name'] = `${ordenantResponse['NOMBRE']}`;
          this.loading = false;
          this.showData = true;
          if (this.beneficiary.localBeneficiaryData.pendingCreation == '1') {
            let time = moment(this.beneficiary.localBeneficiaryData.modificationTime, AppConfig.longTimeFormat).add(30, 'minutes');
            this.warningMessage = this.translateService.instant('errors.creationWarning');
            this.warningMessage += `${time.format(AppConfig.timeFormat)}`;
            this.showWarning = true;
          } else if (this.beneficiary.localBeneficiaryData.pendingModification == '1') {
            let time = moment(this.beneficiary.localBeneficiaryData.modificationTime, AppConfig.longTimeFormat).add(30, 'minutes');
            this.warningMessage = this.translateService.instant('errors.modificationWarning');
            this.warningMessage += `${time.format(AppConfig.timeFormat)}`;
            this.showWarning = true;
          } else {
            this.showWarning = false;
          }
        }
        this.beneficiaryRaw.ordererName = ordenantResponse['NOMBRE'];
      }, error => {
        this.loading = false;
        this.showData = false;
        this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: 'errors.genericError'}
        });
      });
    } else {
      this.beneficiaryRaw = undefined;
      this.beneficiary = undefined;
    }
  }

  resetStepper() {
    this.beneficiary = undefined;
    this.firstStepper = false;
    setTimeout(() => {
      this.firstStepper = true;
    }, 10);
  }

  cleanData() {
    this.showData = false;
    this.beneficiary = undefined;
    this.showWarning = false;
  }

  cleanForm() {
    this.filter.resetForm();
    this.showWarning = false;
  }
}
