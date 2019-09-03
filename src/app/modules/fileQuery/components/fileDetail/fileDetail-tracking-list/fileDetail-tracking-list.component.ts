import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {BaseComponent} from '../../../../../shared/components/base/base.component';

export interface BeneficiaryItem {
  dateTime: string;
  eventProcess: string;
  systemProcess: string;
  status: string;
}


@Component({
  selector: 'two-file-detail-tracking-list',
  templateUrl: './fileDetail-tracking-list.component.html',
  styleUrls: ['./fileDetail-tracking-list.component.scss']
})

export class FileDetailTrackingListComponent extends BaseComponent {
  displayedColumns: string[] = ['folio-column', 'fileName-column', 'ordererName-column', 'cause', 'destinationAccount-column'];
  selection = new SelectionModel<any>(true, []);

  trackingData;

  @Input()
  set setTrackingData(value) {
    if (this.trackingData === value)
      return;
    this.trackingData = value;
    let data = [];
    for (let i = 0; i < this.trackingData.length; i++) {
      data.unshift(this.trackingData[i]);
    }
    this.trackingData = data;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Output() paginatorChange = new EventEmitter();

  constructor() {
    super();
  }
}
