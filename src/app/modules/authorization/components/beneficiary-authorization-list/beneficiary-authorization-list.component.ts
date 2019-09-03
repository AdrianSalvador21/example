import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {OperationsDataSource} from '../../../../core/services/beneficiary-operations-datasource';
import {BeneficiaryService} from '../../../../core/services/index';
import {tap} from 'rxjs/operators';
import {BenefOperation} from '../../../../shared/models/index';
import {fadeInOut} from '../../../../shared/helpers/index';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {TwoPaginatorCustomComponent} from '../../../../shared/components/paginator-custom/paginator-custom.component';
import {AuthorizationService} from '../../../../core/services/authorization.service';
import {MatStepper} from '@angular/material';

@Component({
  selector: 'two-beneficiary-authorization-list',
  templateUrl: './beneficiary-authorization-list.component.html',
  styleUrls: ['./beneficiary-authorization-list.component.scss'],
  animations: [fadeInOut]
})

export class BeneficiaryAuthorizationListComponent extends BaseComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['select', 'operationType', 'operationDate', 'operationTime', 'benefType', 'accountType', 'personType', 'IBUser', 'clientID',
    'ordererName', 'benefAccount', 'benefName', 'currency', 'creatorUser', 'folio'];
  dataSource: OperationsDataSource;
  selection = new SelectionModel<BenefOperation>(false, []);
  @ViewChild(TwoPaginatorCustomComponent) paginator: TwoPaginatorCustomComponent;

  itemSelected: any;
  pageData;

  @Output() paginatorChange = new EventEmitter();
  @Output() selectionChange = new EventEmitter();
  @Input() stepper: MatStepper;

  constructor(private beneficiaryService: BeneficiaryService, private authorizationService: AuthorizationService) {
    super();
  }

  ngOnInit() {
    this.dataSource = new OperationsDataSource(this.beneficiaryService, this.authorizationService);
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
    this.stepper['listBeneficiary'] = this.itemSelected;
  }

  assignRegister(value, item) {
    this.itemSelected = item;
    this.stepper['creationDate'] = item.CREATIONDATE;
    this.stepper['operationType'] = item.OPERATIONTYPE;
    this.stepper['ordererName'] = item.ORDERERNAME;
    this.selection.select(item);
    this.EmitOnChange();
  }
}

