import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {TwoPaginatorCustomComponent} from '../../../../shared/components/paginator-custom/paginator-custom.component';
import * as moment from 'moment';
import {AppConfig} from '../../../../configs/app.config';
import {TranslateService} from '@ngx-translate/core';

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
  selector: 'two-operation-referenced-deposit-list',
  templateUrl: './operation-referenced-deposit-list.component.html',
  styleUrls: ['./operation-referenced-deposit-list.component.scss']
})
export class OperationReferencedDepositListComponent implements OnInit {
  dataListValue;
  displayedColumns: string[];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  selection = new SelectionModel<any>(true, []);
  @ViewChild(TwoPaginatorCustomComponent) paginator: TwoPaginatorCustomComponent;
  itemSelected: any;
  pageData: any;
  @Input()
  showCreatorUser: boolean;
  @Output() paginatorChange = new EventEmitter();
  @Output() selectionChange = new EventEmitter();
  @Output() itemSelectedEmitter = new EventEmitter();

  constructor(private translateService: TranslateService) {
  }

  @Input() total;
  inputTotal = 0;

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
      this.inputTotal = this.total;
      this.dataListValue = value;
    }
    this.dataListValue.forEach(raw => {
      if (raw.CREATIONDATE !== '') {
        raw['operationDate'] = moment(raw.CREATIONDATE, AppConfig.isoDateFormat).format(AppConfig.dateFormat);
        raw['operationTime'] = moment(raw.CREATIONDATE, AppConfig.isoDateFormat).format(AppConfig.longTimeFormat);
        raw.CREATIONDATE = moment(raw.CREATIONDATE, AppConfig.isoDateFormat).format(AppConfig.dateAndTimeFormat);
      } else {
        raw['operationDate'] = '';
        raw['operationTime'] = '';
      }
      if (raw.AUTHDATE !== '') {
        raw['authDate'] = moment(raw.AUTHDATE, AppConfig.isoDateFormat).format(AppConfig.dateFormat);
        raw['authTime'] = moment(raw.AUTHDATE, AppConfig.isoDateFormat).format(AppConfig.longTimeFormat);
        raw.AUTHDATE = moment(raw.AUTHDATE, AppConfig.isoDateFormat).format(AppConfig.dateAndTimeFormat);
      } else {
        raw['authDate'] = '';
        raw['authTime'] = '';
      }

      if (raw.channel !== '') {
        if (raw.channel.toLowerCase() === 'adaptor') {
          raw.channel = this.translateService.instant('general.adaptor-label');
        } else if (raw.channel.toLowerCase() === 'internet') {
          raw.channel = this.translateService.instant('general.ib-label');
        }
      }
    });
  }

  ngOnInit() {
    if (this.showCreatorUser) {
      this.displayedColumns = ['select', 'operation', 'postingDate', 'postingTime', 'clientID', 'chargeAccount', 'creditAccount', 'totalLines', 'creator-user',
        'authorizator-user', 'authDate', 'authTime', 'currency', 'amount', 'channel', 'status', 'folio'];
    } else {
      this.displayedColumns = ['select', 'operation', 'postingDate', 'postingTime', 'clientID', 'chargeAccount', 'creditAccount', 'totalLines', 'authorizator-user',
        'authDate', 'authTime', 'currency', 'amount', 'channel', 'status', 'folio'];
    }
  }

  assignRegister($event, item) {
    this.itemSelectedEmitter.emit(item);
  }

  emmitPageChange(pageData) {

    this.paginatorChange.emit(pageData.pageIndex + 1);
  }

}
