import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatStep, MatStepper, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {TwoPaginatorCustomComponent} from '../../../../shared/components/paginator-custom/paginator-custom.component';
import * as moment from 'moment';
import {AppConfig} from '../../../../configs/app.config';

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
  selector: 'two-operation-beneficiaries-list',
  templateUrl: './operation-beneficiaries-list.component.html',
  styleUrls: ['./operation-beneficiaries-list.component.scss']
})
export class OperationBeneficiariesListComponent implements OnInit {
  dataListValue;
  @Input()
  stepper: MatStepper;
  @Input() total;
  inputTotal = 0;
  @Input()
  showCreatorUser: boolean;

  @Input()
  set dataList(value) {
    this.inputTotal = 0;

    if (this.dataListValue === value) {
      return;
    }
    if (value.length == 0 || value == undefined) {
      this.dataListValue = undefined;
      return;
    } else {
      this.dataListValue = value;
      // this.total = this.dataListValue.TOTAL;
      this.inputTotal = this.total;
    }

    this.dataListValue.forEach(raw => {
      if (raw.CREATIONDATE !== '') {
        raw['operationDate'] = moment(raw.CREATIONDATE, AppConfig.isoDateFormat).format(AppConfig.dateFormat);
        raw['operationTime'] = moment(raw.CREATIONDATE, AppConfig.isoDateFormat).format(AppConfig.longTimeFormat);
      } else {
        raw['operationDate'] = '';
        raw['operationTime'] = '';
      }
      if (raw.AUTHDATE !== '') {
        raw['authDate'] = moment(raw.AUTHDATE, AppConfig.isoDateFormat).format(AppConfig.dateFormat);
        raw['authTime'] = moment(raw.AUTHDATE, AppConfig.isoDateFormat).format(AppConfig.longTimeFormat);
      } else {
        raw['authDate'] = '';
        raw['authTime'] = '';
      }
    });

  }

  displayedColumns = [];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  selection = new SelectionModel<any>(true, []);
  @ViewChild(TwoPaginatorCustomComponent) paginator: TwoPaginatorCustomComponent;

  itemSelected: any;
  pageData: any;

  @Output() itemSelectedEmitter = new EventEmitter();


  @Output() paginatorChange = new EventEmitter();
  @Output() selectionChange = new EventEmitter();

  constructor() {

  }

  ngOnInit() {
    if (this.showCreatorUser) {
      this.displayedColumns = ['select', 'operation-column', 'beneficiaryType', 'operationDate', 'operationTime', 'accountType-column', 'personType', 'ib-user', 'clientNumber-column',
        'ordererName', 'beneficiaryAccount-column', 'beneficiary-name', 'currency', 'creator-user', 'authorizator-user', 'authDate', 'authTime', 'operationStatus-column', 'folio-column'];
    } else {
      this.displayedColumns = ['select', 'operation-column', 'beneficiaryType', 'operationDate', 'operationTime', 'accountType-column', 'personType', 'ib-user', 'clientNumber-column',
        'ordererName', 'beneficiaryAccount-column', 'beneficiary-name', 'currency', 'authorizator-user', 'authDate', 'authTime', 'operationStatus-column', 'folio-column'];
    }
  }

  assignRegister($event, item) {
    this.itemSelectedEmitter.emit(item);
    this.stepper['listBeneficiary'] = item;
    this.stepper['ordererName'] = item.ORDERERNAME;
  }

  emmitPageChange(pageData) {

    this.paginatorChange.emit(pageData.pageIndex + 1);
  }
}
