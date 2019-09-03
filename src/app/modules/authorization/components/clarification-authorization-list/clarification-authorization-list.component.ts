import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {ClarificationService} from '../../../../core/services/index';
import {tap} from 'rxjs/operators';
import {BenefOperation} from '../../../../shared/models/index';
import {fadeInOut} from '../../../../shared/helpers/index';
import {TwoPaginatorCustomComponent} from '../../../../shared/components/paginator-custom/paginator-custom.component';
import {ClarificationDataSource} from '../../../../core/services/clarification-operations-datasource';
import {AuthorizationService} from '../../../../core/services/authorization.service';
import {MatStepper} from '@angular/material';

@Component({
  selector: 'two-clarification-authorization-list',
  templateUrl: './clarification-authorization-list.component.html',
  styleUrls: ['./clarification-authorization-list.component.scss'],
  animations: [fadeInOut]
})

export class ClarificationAuthorizationListComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['select', 'operation', 'operatorUser', 'operatorRole', 'operationDate', 'clientNumber', 'accountType',
    'beneficiaryAccount', 'operationStatus'];
  dataSource: ClarificationDataSource;
  selection = new SelectionModel<BenefOperation>(true, []);
  @ViewChild(TwoPaginatorCustomComponent) paginator: TwoPaginatorCustomComponent;

  @Output() paginatorChange = new EventEmitter();
  @Output() selectionChange = new EventEmitter();
  @Input() stepper: MatStepper;

  itemSelected: any;

  constructor(private clarificationService: ClarificationService, private authorizationService: AuthorizationService) {
  }

  ngOnInit() {
    this.dataSource = new ClarificationDataSource(this.clarificationService, this.authorizationService);
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
    this.selection.isSelected(item);
    this.EmitOnChange();
  }
}

