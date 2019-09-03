import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {tap} from 'rxjs/operators';
import {UnitQueryOperation} from '../../../../shared/models';
import {fadeInOut} from '../../../../shared/helpers';
import {TwoPaginatorCustomComponent} from '../../../../shared/components/paginator-custom/paginator-custom.component';
import {AuthorizationService} from '../../../../core/services/authorization.service';
import {UnitQueryDataSource} from '../../../../core/services/unitQuery-operations-datasource';
import {MatStepper} from '@angular/material';

@Component({
  selector: 'two-unitQuery-authorization-list',
  templateUrl: './unitQuery-authorization-list.component.html',
  styleUrls: ['./unitQuery-authorization-list.component.scss'],
  animations: [fadeInOut]
})

export class UnitQueryAuthorizationListComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['select', 'folio', 'clientID', 'ordererName', 'ordererAccount', 'applicationDate', 'applicationTime', 'amount',
    'paymentType', 'currency', 'reference', 'creatorUser', 'paymentStatus', 'paymentFolio'];
  dataSource: UnitQueryDataSource;
  selection = new SelectionModel<UnitQueryOperation>(true, []);
  @ViewChild(TwoPaginatorCustomComponent) paginator: TwoPaginatorCustomComponent;

  @Output() paginatorChange = new EventEmitter();
  @Output() selectionChange = new EventEmitter();
  @Input() stepper: MatStepper;

  itemSelected: any;

  constructor(private authorizationService: AuthorizationService) {
  }

  ngOnInit() {
    this.dataSource = new UnitQueryDataSource(this.authorizationService);
    this.dataSource.length$.pipe().subscribe(res => {
      this.paginator.length = this.paginator.length = parseInt(this.authorizationService.totalOperations);
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

