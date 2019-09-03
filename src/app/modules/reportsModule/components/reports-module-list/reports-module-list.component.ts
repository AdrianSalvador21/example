import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatStepper} from '@angular/material';
import {TwoPaginatorCustomComponent} from '../../../../shared/components/paginator-custom/paginator-custom.component';
import {tap} from 'rxjs/operators';
import {DecisionDialog} from '../../../../shared/components/decision-dialog/decision-dialog.component';
import {MODAL_SIZE, scrollToTop} from '../../../../shared/helpers';

@Component({
  selector: 'two-reports-module-list',
  templateUrl: './reports-module-list.component.html',
  styleUrls: ['./reports-module-list.component.scss']
})
export class ReportsModuleListComponent implements OnInit {

  @ViewChild(TwoPaginatorCustomComponent) paginator: TwoPaginatorCustomComponent;
  @Output() paginatorChange = new EventEmitter();
  listData;
  listTotal = 0;
  message = '';
  itemSelected;
  displayedColumns: string[] = ['file' , 'description', 'report', 'date', 'download'];

  constructor(public dialog: MatDialog) {
  }

  @Input()
  set listDataInput(value) {
    this.listTotal = value[0].total;
    this.listData = value;
  }

  ngOnInit() {
  }

}
