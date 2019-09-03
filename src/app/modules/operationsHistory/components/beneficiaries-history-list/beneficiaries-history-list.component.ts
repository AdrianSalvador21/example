import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatStepper, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {Router} from '@angular/router';
import {scrollToTop} from '../../../../shared/helpers';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import * as moment from 'moment';
import {AppConfig} from '../../../../configs/app.config';
import {BeneficiaryService, OperationsHistoryService} from '../../../../core/services';

const ELEMENT_DATA: any[] = [
  {
    folio: 'xxxxxxxxxxxx',
    trackingkey: 'xxxxxxxxxxxxxxx',
    clientnumber: 'xxxxxxxxxx',
    destinyaccount: 'xxxxxxxxxxx',
    creationdate: 'xx/xx/xx',
    import: 'xxxxxxxxxxxxxxx',
    beneficiaryaccount: 'xxxxxxxxxxxxxx'
  },
  {
    folio: 'xxxxxxxxxxxx',
    trackingkey: 'xxxxxxxxxxxxxxx',
    clientnumber: 'xxxxxxxxxx',
    destinyaccount: 'xxxxxxxxxxx',
    creationdate: 'xx/xx/xx',
    import: 'xxxxxxxxxxxxxxx',
    beneficiaryaccount: 'xxxxxxxxxxxxxx'
  },
  {
    folio: 'xxxxxxxxxxxx',
    trackingkey: 'xxxxxxxxxxxxxxx',
    clientnumber: 'xxxxxxxxxx',
    destinyaccount: 'xxxxxxxxxxx',
    creationdate: 'xx/xx/xx',
    import: 'xxxxxxxxxxxxxxx',
    beneficiaryaccount: 'xxxxxxxxxxxxxx'
  },
  {
    folio: 'xxxxxxxxxxxx',
    trackingkey: 'xxxxxxxxxxxxxxx',
    clientnumber: 'xxxxxxxxxx',
    destinyaccount: 'xxxxxxxxxxx',
    creationdate: 'xx/xx/xx',
    import: 'xxxxxxxxxxxxxxx',
    beneficiaryaccount: 'xxxxxxxxxxxxxx'
  }
];

@Component({
  selector: 'two-beneficiaries-history-list',
  templateUrl: './beneficiaries-history-list.component.html',
  styleUrls: ['./beneficiaries-history-list.component.scss']
})
export class BeneficiariesHistoryListComponent extends BaseComponent implements OnInit {

  data;
  total = 0;
  loading = false;
  @Output() selectedItemEmitter = new EventEmitter();
  displayedColumns: string[] = ['select', 'folio', 'channel', 'date', 'time', 'clientNumber', 'benefType',
    'accountsNumber', 'benefAlias', 'benefName', 'justify', 'operatorUser', 'authUser', 'action'];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  selection = new SelectionModel<any>(true, []);
  pageData: Object;
  selectedItem: any = '';
  @Input()
  stepper: MatStepper;
  @Output()
  pageEmitter = new EventEmitter();

  constructor(public router: Router, public operationsHistoryService: OperationsHistoryService, private beneficiaryService: BeneficiaryService) {
    super();
  }

  ngOnInit() {
  }

  @Input()
  set dataInput(value) {
    if (this.data == value)
      return;
    this.data = value[0];
    // TODO change this line
    this.total = 5;
    this.data.forEach((element) => {
      if (element.benefType === 'N') {
        element.benefType = 'Nacional';
      } else if (element.benefType === 'I') {
        element.benefType = 'Internacional';
      } else {
        element.benefType = '';
      }

      if (element.operationDate !== '') {
        element['date'] = moment(element.operationDate, AppConfig.dateAndTimeFormatTwo).format(AppConfig.dateFormat);
        element['time'] = moment(element.operationDate, AppConfig.dateAndTimeFormatTwo).format(AppConfig.longTimeFormat);
      } else {
        element['date'] = '';
        element['time'] = '';
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  viewDetail() {
    this.loading = true;
    const data = this.selectedItem;

    this.operationsHistoryService.getBeneficiariesHistoryDetail(data.clientID, data.benefAccNumber, data.trackId)
      .subscribe(response => {
        const arrayData = response.data[0];
        const dataObject: any = {};
        arrayData.forEach((register) => {
          dataObject[register['FIELDNAME4095']] = register['FIELDVALUE4095'];
        });

        this.beneficiaryService.getBeneficiaryDetail(this.selectedItem.clientID).subscribe(ordenantDataResponse => {
          let ordenantData;
          if (ordenantDataResponse.errorCode !== 0) {
            return;
          } else {
            ordenantData = JSON.parse(ordenantDataResponse.data);
          }
          let data = {};
          if (dataObject.tipbenef === 'N') {
            data = {
              benefCreationDate: dataObject.FECHA_ALTA,
              benefCreationTime: dataObject.HORA_ALTA,
              benefDocCountry: dataObject.benefDocCountry,
              benefDocNumber: dataObject.benefDocNumber,
              benefDocType: dataObject.benefDocType,
              ordererName: ordenantData.NOMBRE,
              benefJustification: !dataObject.Justificacion ? '' : dataObject.benefJustificacion,
              benefNumber: '',
              benefType: dataObject.tipbenef,
              benefStatus: dataObject.benefStatus,
              beneficiaryAccountNumber: this.selectedItem.benefAccNumber,
              beneficiaryAccountType: dataObject.benefAccountType,
              beneficiaryBank: dataObject.bankName,
              clientNumber: !this.selectedItem.clientID ? '' : this.selectedItem.clientID,
              channel: this.selectedItem.channel,
              personType: dataObject.TipPersona,
              currency: dataObject.benefAccountCurrency,
              diaryId: '',
              FOLIO: this.selectedItem.folio,
              operationType: this.selectedItem.action,
              localBeneficiaryData: {
                alias: this.selectedItem.benefAlias,
                benefBank: dataObject.bankName,
                curp: !!dataObject.curp ? dataObject.curp : '',
                email: dataObject.Mail,
                firstLastName: dataObject.Apellido1,
                secondLastName: dataObject.Apellido2,
                justification: dataObject.Justificacion,
                channel: this.selectedItem.channel,
                legalReference: !!dataObject.Nombre ? dataObject.Nombre : dataObject.RazSoc,
                maximumAmount: dataObject.MtoMax,
                modificationDate: this.selectedItem.date,
                modificationTime: this.selectedItem.time,
                phone: !dataObject.NroTelefono ? '' : dataObject.NroTelefono,
                reason: !dataObject.Justificacion ? '' : dataObject.Justificacion,
                rfc: dataObject.benefDocNumber,
                userIB: dataObject.usuarioib
              }
            };
            data['internationalBeneficiary'] = false;
            if (data['beneficiaryAccountType'] === '40' && data['currency'] === 'USD') {
              data['beneficiaryAccountType'] = '41';
            } else if (data['beneficiaryAccountType'] === '40' && data['currency'] === 'MXN') {
              data['beneficiaryAccountType'] = '40';
            }
            this.stepper['folio'] = this.selectedItem.folio;
            this.stepper['data'] = data;
            this.loading = false;
            this.stepper.next();
            scrollToTop();
          } else {
            data = {
              benefType: 'I',
              personType: dataObject.TipPersona,
              operationType: this.selectedItem.action,
              clientNumber: this.selectedItem.clientID,
              currency: dataObject.benefAccountCurrency,
              beneficiaryAccountType: dataObject.benefAccountType,
              beneficiaryAccountNumber: dataObject.benefAccountNumber,
              internationalBeneficiary: true,
              benefStatus: dataObject.benefStatus,
              channel: this.selectedItem.channel,
              beneficiaryStatus: dataObject.benefStatus,
              internationalBeneficiaryData: {
                email: dataObject.Mail,
                justification: this.selectedItem.benefJustification,
                alias: this.selectedItem.benefAlias,
                beneficiaryName: this.selectedItem.benefName,
                beneficiaryCountry: '',
                maximumAmount: dataObject.Limite,
                beneficiaryCity: dataObject.CddBeneficiario,
                userIB: dataObject.usuarioib,
                beneficiaryAddress: dataObject.DomBeneficiario,
                charges: dataObject.Gastos,
                loadDate: dataObject.FECHA_ALTA,
                loadTime: dataObject.HORA_ALTA,
                modificationDate: this.selectedItem.date,
                modificationTime: this.selectedItem.time
              },
              ordenantData: {
                name: ordenantData.NOMBRE,
                address: `${ordenantData.CALLE} ${ordenantData.NRO_PUERTA} ${ordenantData.LOCALIDAD}`,
                country: ordenantData.PAIS,
                city: ordenantData.CIUDAD
              },
              intermediaryBankData: {
                intermediaryBankBic: '',
                intermediaryBank: '',
                beneficiaryAddress: '',
                beneficiaryCountry: '',
                beneficiaryCity: ''
              }
            };
            data['internationalBeneficiary'] = true;
            this.stepper['folio'] = this.selectedItem.folio;
            this.stepper['data'] = data;
            this.loading = false;
            this.stepper.next();
            scrollToTop();
          }
        });

      });
  }

  assignRegister(item) {
    this.selectedItem = item;
  }

  emmitPage(page) {
    this.pageEmitter.emit(page.pageIndex + 1);
  }

}
