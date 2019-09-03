import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {tap} from 'rxjs/operators';
import {BenefOperation} from '../../../../shared/models';
import {fadeInOut} from '../../../../shared/helpers';
import {TwoPaginatorCustomComponent} from '../../../../shared/components/paginator-custom/paginator-custom.component';
import {AuthorizationService} from '../../../../core/services/authorization.service';
import {ReferencedDepositDataSource} from '../../../../core/services/referencedDeposit-operations-datasource';
import {ReferencedPaymentService} from '../../../../core/services/referencedPayment.service';
import {MatStepper} from '@angular/material';

@Component({
  selector: 'two-referencedDeposit-authorization-list',
  templateUrl: './referencedDeposit-authorization-list.component.html',
  styleUrls: ['./referencedDeposit-authorization-list.component.scss'],
  animations: [fadeInOut]
})

export class ReferencedDepositAuthorizationListComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['select', 'operation', 'postingDate', 'postingTime', 'clientID', 'chargeAccount', 'creditAccount', 'totalLines',
    'currency', 'amount', 'channel', 'operatorUser', 'status', 'folio'];
  dataSource: ReferencedDepositDataSource;
  selection = new SelectionModel<any>(true, []);
  @ViewChild(TwoPaginatorCustomComponent) paginator: TwoPaginatorCustomComponent;

  @Output() paginatorChange = new EventEmitter();
  @Output() selectionChange = new EventEmitter();
  @Input() stepper: MatStepper;

  itemSelected: any;

  constructor(public referencedPaymentService: ReferencedPaymentService, private authorizationService: AuthorizationService) {
  }

  ngOnInit() {
    this.dataSource = new ReferencedDepositDataSource(this.referencedPaymentService, this.authorizationService);
    this.dataSource.length$.pipe().subscribe(res => {
      if (this.paginator) {
        this.paginator.length = parseInt(this.authorizationService.totalOperations);
        this.paginator.getRanges();
      }
    });
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page
        .pipe(
          tap(() => {
            this.paginatorChange.emit([(this.paginator.pageIndex + 1), this.paginator.pageSize]);
          })
        )
        .subscribe();
    }

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

