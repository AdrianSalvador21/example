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
  selector: 'two-operation-file-query-list',
  templateUrl: './operation-file-query-list.component.html',
  styleUrls: ['./operation-file-query-list.component.scss']
})
export class OperationFileQueryListComponent implements OnInit {
  dataListValue;
  displayedColumns: string[];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  selection = new SelectionModel<any>(true, []);
  @ViewChild(TwoPaginatorCustomComponent) paginator: TwoPaginatorCustomComponent;
  itemSelected: any;
  pageData: any;
  @Input()
  showCreatorUser: boolean;
  @Output() itemSelectedEmitter = new EventEmitter();
  @Output() paginatorChange = new EventEmitter();
  @Output() selectionChange = new EventEmitter();

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
      this.dataListValue = value;
      this.inputTotal = this.total;
    }

    // let time = moment(this.beneficiary.internationalBeneficiaryData.modificationTime, AppConfig.longTimeFormat).add(30, 'minutes');

    this.dataListValue.forEach(raw => {
      if (raw.CREATIONDATE !== '') {
        raw['operationDate'] = moment(raw.CREATIONDATE, AppConfig.isoDateFormat).format(AppConfig.dateFormat);
        raw['operationTime'] = moment(raw.CREATIONDATE, AppConfig.isoDateFormat).format(AppConfig.longTimeFormat);
      }
      if (raw.AUTHDATE !== '') {
        raw['authDate'] = moment(raw.AUTHDATE, AppConfig.isoDateFormat).format(AppConfig.dateFormat);
        raw['authTime'] = moment(raw.AUTHDATE, AppConfig.isoDateFormat).format(AppConfig.longTimeFormat);
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
      this.displayedColumns = ['select', 'folio', 'fileName', 'clientID', 'clientName', 'chargeAccount', 'postingDate', 'operationTime', 'totalAmount',
        'totalLines', 'ownAccounts', 'sabAccounts', 'otherBanks', 'chargeType', 'fileType', 'channel', 'creator-user', 'authorizator-user', 'authDate', 'authTime', 'status', 'fileFolio'];
    } else {
      this.displayedColumns = ['select', 'folio', 'fileName', 'clientID', 'clientName', 'chargeAccount', 'postingDate', 'operationTime', 'totalAmount',
        'totalLines', 'ownAccounts', 'sabAccounts', 'otherBanks', 'chargeType', 'fileType', 'channel', 'authorizator-user', 'authDate', 'authTime', 'status', 'fileFolio'];
    }
  }

  assignRegister($event, item) {
    this.itemSelectedEmitter.emit(item);
  }

  emmitPageChange(pageData) {

    this.paginatorChange.emit(pageData.pageIndex + 1);
  }

}
