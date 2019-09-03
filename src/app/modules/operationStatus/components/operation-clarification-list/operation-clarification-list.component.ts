import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {TwoPaginatorCustomComponent} from '../../../../shared/components/paginator-custom/paginator-custom.component';

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
  selector: 'two-operation-clarification-list',
  templateUrl: './operation-clarification-list.component.html',
  styleUrls: ['./operation-clarification-list.component.scss']
})
export class OperationClarificationListComponent implements OnInit {
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

  constructor() {
  }

  @Input() total;

  @Input()
  set dataList(value) {
    if (this.dataListValue === value) {
      return;
    }
    if (value.length == 0 || value == undefined) {
      this.dataListValue = undefined;
      return;
    } else {
      this.dataListValue = value;
    }
  }

  ngOnInit() {

    if (this.showCreatorUser) {
      this.displayedColumns = ['select', 'folio', 'postingDate', 'reference', 'chargeAccount', 'clientName', 'destinyAccount',
        'amount', 'channel', 'creator-user', 'authorizator-user', 'status', 'fileFolio'];
    } else {
      this.displayedColumns = ['select', 'folio', 'postingDate', 'reference', 'chargeAccount', 'clientName', 'destinyAccount',
        'amount', 'channel', 'authorizator-user', 'status', 'fileFolio'];
    }
  }

  assignRegister($event, item) {
    this.itemSelectedEmitter.emit(item);
  }

  emmitPageChange(pageData) {

    this.paginatorChange.emit(pageData.pageIndex + 1);
  }

}
