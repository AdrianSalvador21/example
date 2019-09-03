import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatStepper, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {BaseComponent} from '../../../../../shared/components/base/base.component';
import {scrollToTop} from '../../../../../shared/helpers';

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
  selector: 'two-clarifications-list',
  templateUrl: './clarifications-list.component.html',
  styleUrls: ['./clarifications-list.component.scss']
})
export class ClarificationsListComponent extends BaseComponent implements OnInit {
  @Output()
  pageIndexOutput = new EventEmitter();

  @Input()
  stepper: MatStepper;
  pageData;

  listQueryData;
  totalUnitQuery;
  displayedColumns: string[] = ['select', 'folio', 'creationdate', 'creationtime', 'destinyaccount', 'clientnumber', 'cve_rastreo', 'import', 'beneficiaryaccount', 'trackingkey', 'service', 'channel', 'status', 'fileFolio'];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  selection = new SelectionModel<any>(true, []);
  itemSelected: any;

  constructor() {
    super();
  }

  @Input()
  set listDataUnit(value) {
    this.itemSelected = undefined;
    if (this.listQueryData == value) {
      return;
    }
    this.listQueryData = value;
    this.totalUnitQuery = this.listQueryData[0].Total;
  }

  ngOnInit() {
  }

  assignRegister(item) {
    this.itemSelected = item;
  }

  showDetail() {
    if (!!this.itemSelected) {
      this.stepper['dataUnitQuerySelected'] = this.itemSelected;
      this.stepper.next();
      scrollToTop();
    }
  }

  emmitPageNumber(page) {
    if (page !== undefined) {
      this.pageIndexOutput.emit(page.pageIndex + 1);
    }
  }

}
