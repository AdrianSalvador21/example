import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {TwoPaginatorCustomComponent} from '../../../../shared/components/paginator-custom/paginator-custom.component';
import * as moment from 'moment';
import {AppConfig} from '../../../../configs/app.config';


@Component({
  selector: 'two-operation-unit-query-list',
  templateUrl: './operation-unit-query-list.component.html',
  styleUrls: ['./operation-unit-query-list.component.scss']
})
export class OperationUnitQueryListComponent implements OnInit {
  dataListValue;
  displayedColumns: string[];
  @ViewChild(TwoPaginatorCustomComponent) paginator: TwoPaginatorCustomComponent;
  itemSelected: any;
  pageData: any;
  @Input()
  showCreatorUser: boolean;
  @Output() paginatorChange = new EventEmitter();
  @Output() selectionChange = new EventEmitter();
  @Output() itemSelectedEmitter = new EventEmitter();

  constructor() {
  }

  @Input() total;
  inputTotal = 0;

  @Input()
  set dataList(value) {
    this.inputTotal = 0;
    if (this.dataListValue === value)
      return;
    if (value.length == 0 || value == undefined) {
      this.dataListValue = undefined;
      return;
    } else {
      this.dataListValue = value;
      this.inputTotal = this.total;
    }

    this.dataListValue.forEach( raw => {
      if (raw.CREATIONDATE !== '') {
        raw['operationDate'] = moment(raw.CREATIONDATE, AppConfig.isoDateFormat).format(AppConfig.dateFormat);
        raw['operationTime'] = moment(raw.CREATIONDATE, AppConfig.isoDateFormat).format(AppConfig.longTimeFormat);
      }
      if (raw.AUTHDATE !== '') {
        raw['authDate'] = moment(raw.AUTHDATE, AppConfig.isoDateFormat).format(AppConfig.dateFormat);
        raw['authTime'] = moment(raw.AUTHDATE, AppConfig.isoDateFormat).format(AppConfig.longTimeFormat);
      }
    });
  }

  ngOnInit() {
    if (this.showCreatorUser) {
      this.displayedColumns = ['select', 'folio', 'clientID', 'ordererName', 'ordererAccount', 'applicationDate', 'applicationTime', 'amount',
        'paymentType', 'currency', 'reference', 'creator-user', 'authorizator-user', 'authDate', 'authTime', 'paymentStatus', 'paymentId'];
    }else{
      this.displayedColumns = ['select', 'folio', 'clientID', 'ordererName', 'ordererAccount', 'applicationDate', 'applicationTime', 'amount',
        'paymentType', 'currency', 'reference', 'authorizator-user', 'authDate', 'authTime', 'paymentStatus', 'paymentId'];
    }
  }

  assignRegister($event, item) {
    this.itemSelectedEmitter.emit(item);
  }

  emmitPageChange(pageData) {

    this.paginatorChange.emit(pageData.pageIndex + 1);
  }

}
