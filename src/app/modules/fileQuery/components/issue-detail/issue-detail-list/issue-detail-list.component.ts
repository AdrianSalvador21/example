import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {BaseComponent} from '../../../../../shared/components/base/base.component';

const ELEMENT_DATA: any[] = [
  {
    ordinal: 'xxx',
    subordinal: 'xxx',
    sucursal: 'xxxxxxxxx',
    rubro: 'xxxxxxxxxx',
    nombrerubro: 'xxxxxxxxx',
    moneda: 'xxx',
    especie: 'xxx',
    cuenta: 'xxxxxxxxxx',
    operacion: 'xxxxxxxxx',
    suboperacion: 'xxx',
    dh: 'xxx',
    importe: 'xxxxxxx'
  },
  {
    ordinal: 'xxx',
    subordinal: 'xxx',
    sucursal: 'xxxxxxxxx',
    rubro: 'xxxxxxxxxx',
    nombrerubro: 'xxxxxxxxx',
    moneda: 'xxx',
    especie: 'xxx',
    cuenta: 'xxxxxxxxxx',
    operacion: 'xxxxxxxxx',
    suboperacion: 'xxx',
    dh: 'xxx',
    importe: 'xxxxxxx'
  }
];

@Component({
  selector: 'two-issue-detail-list',
  templateUrl: './issue-detail-list.component.html',
  styleUrls: ['./issue-detail-list.component.scss']
})
export class IssueDetailListComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['orderer', 'subordinal', 'branch_office', 'entry', 'entryname', 'currency', 'species', 'account', 'operation', 'suboperation', 'dh', 'import'];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  selection = new SelectionModel<any>(true, []);

  listData;

  @Input()
  set listDataInput(value) {
    this.listData = value;
  }

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
