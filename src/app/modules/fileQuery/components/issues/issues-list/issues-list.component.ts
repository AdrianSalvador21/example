import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatStepper, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {Router} from '@angular/router';
import {BaseComponent} from '../../../../../shared/components/base/base.component';
import {scrollToTop} from '../../../../../shared/helpers';

export interface BeneficiaryItem {
  folio: string;
  executionDate: string;
  reference: string;
  ordererAcc: string;
  clientName: string;
  benefAcc: string;
  amount: string;
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
  selector: 'two-incidentes-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss']
})

export class IssuesListComponent extends BaseComponent {

  dataIssues;
  totalIssues = 0;
  @Output() selectedItemEmitter = new EventEmitter();
  displayedColumns: string[] = ['select', 'folio', 'applicationDate', 'reference', 'operationType', 'accountCharge',
    'clientName', 'destinyAccount', 'amount', 'fileFolio'];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  selection = new SelectionModel<any>(true, []);
  pageData: Object;
  selectedItem: any = '';
  @Input()
  stepper: MatStepper;
  @Output()
  pageEmitter = new EventEmitter();

  constructor(public router: Router) {
    super();
  }

  @Input()
  set dataIssuesInput(value) {
    if (this.dataIssues === value)
      return;
    this.dataIssues = value;
    this.totalIssues = this.dataIssues[0].Total;
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
    this.stepper['dataIssue'] = this.selectedItem;
    this.stepper.next();
    scrollToTop();
  }

  assignRegister(item) {
    this.selectedItem = item;
  }

  emmitPage(page) {
    this.pageEmitter.emit(page.pageIndex + 1);
  }


}
