import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {tap} from 'rxjs/operators';
import {BatchOperation} from '../../../../shared/models/index';
import {fadeInOut} from '../../../../shared/helpers/index';
import {TwoPaginatorCustomComponent} from '../../../../shared/components/paginator-custom/paginator-custom.component';
import {AuthorizationService} from '../../../../core/services/authorization.service';
import {BatchDataSource} from '../../../../core/services/batch-operations-datasource';
import {MatStepper} from '@angular/material';

@Component({
  selector: 'two-batch-authorization-list',
  templateUrl: './batch-authorization-list.component.html',
  styleUrls: ['./batch-authorization-list.component.scss'],
  animations: [fadeInOut]
})

export class BatchAuthorizationListComponent implements AfterViewInit, OnInit {

  displayedColumns: string[];
  dataSource: BatchDataSource;
  selection = new SelectionModel<BatchOperation>(false, []);
  @ViewChild(TwoPaginatorCustomComponent) paginator: TwoPaginatorCustomComponent;

  @Output() paginatorChange = new EventEmitter();
  @Output() selectionChange = new EventEmitter();
  @Input() stepper: MatStepper;
  @Input() cantSignatures: string;

  itemSelected: any;

  constructor(private authorizationService: AuthorizationService) {
  }

  ngOnInit() {
    if (this.cantSignatures !== '1') {
      this.displayedColumns = ['select', 'folio', 'fileName', 'applicationDate', 'applicationTime', 'currency', 'chargeType', 'fileType', 'totalAmount',
        'totalLines', 'ownAccounts', 'thirdSabadell', 'otherAccountsSPEI', 'creatorUser', 'channel', 'status', 'fileFolio'];
    } else {
      this.displayedColumns = ['select', 'folio', 'fileName', 'applicationDate', 'applicationTime', 'currency', 'chargeType', 'fileType', 'totalAmount',
        'totalLines', 'ownAccounts', 'thirdSabadell', 'otherAccountsSPEI', 'creatorUser', 'channel', 'status', 'fileFolio', 'authUser', 'authDate', 'authTime'];
    }
    this.dataSource = new BatchDataSource(this.authorizationService);
    this.dataSource.length$.pipe().subscribe(res => {
      this.paginator.length = parseInt(this.authorizationService.totalOperations);
      this.paginator.getRanges();
    });
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() => {
          this.paginatorChange.emit([(this.paginator.pageIndex + 1), this.paginator.pageSize]);
        })
      )
      .subscribe();
  }

  OnRowClick(row) {
  }

  EmitOnChange() {
    this.selectionChange.emit(this.itemSelected);
  }

  assignRegister(value, item) {
    this.itemSelected = item;
    this.selection.select(item);
    this.EmitOnChange();
  }
}

