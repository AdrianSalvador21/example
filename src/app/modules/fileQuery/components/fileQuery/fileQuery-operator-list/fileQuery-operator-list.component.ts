import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {BaseComponent} from '../../../../../shared/components/base/base.component';
import {FileQueryService} from '../../../../../core/services/fileQuery.service';
import {AppConfig} from '../../../../../configs/app.config';
import * as moment from 'moment';

export interface BeneficiaryItem {
  folio: string;
  fileName: string;
  ordererName: string;
  destinationAccount: string;
  applicationDate: string;
  amount: string;
  chargeType: string;
  fileType: string;
  channel: string;
  operatorUser: string;
  rfcOrderer: string;
  serviceType: string;
  status: string;
}

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
  selector: 'two-file-query-operator-list',
  templateUrl: './fileQuery-operator-list.component.html',
  styleUrls: ['./fileQuery-operator-list.component.scss']
})

export class FileQueryOperatorListComponent extends BaseComponent {

  dataFiles;
  pageData;

  @Output()
  emitterPage: EventEmitter<any> = new EventEmitter;

  @Output()
  assignFileSelected: EventEmitter<any> = new EventEmitter;

  @Input() totalFiles: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() paginatorChange = new EventEmitter();
  displayedColumns: string[] = ['select', 'folio-column', 'fileName-column', 'ordererName-column', 'destinationAccount-column',
    'applicationDate-column', 'applicationTime-column', 'amount-column', 'chargeType-column', 'fileType-column', 'channel-column', 'operatorUser-column', 'status'];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  selection = new SelectionModel<any>(true, []);
  itemSelected: any;

  constructor(fileQueryService: FileQueryService) {
    super();
    // this.totalFiles = fileQueryService.totalFiles;
  }

  @Input()
  set dataList(value) {
    if (this.dataFiles === value)
      return;
    this.dataFiles = value;
    this.dataFiles.forEach( raw => {
      if (raw.applicationDateTo !== '') {
        raw['applicationDate'] = moment(raw.applicationDateTo, AppConfig.isoDateFormat).format(AppConfig.dateFormat);
        raw['applicationTime'] = moment(raw.applicationDateTo, AppConfig.isoDateFormat).format(AppConfig.longTimeFormat);
      } else {
        raw['applicationDate'] = '';
        raw['applicationTime'] = '';
      }
    });
  }

  emitter(pageData: any) {
    this.emitterPage.emit(pageData.pageIndex + 1);
  }

  assignRegister(item) {
    this.assignFileSelected.emit(item);
  }
}
