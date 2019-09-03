import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {FileQueryService} from '../../../../core/services/index';
import {tap} from 'rxjs/operators';
import {FileQueryOperation} from '../../../../shared/models/index';
import {fadeInOut} from '../../../../shared/helpers/index';
import {TwoPaginatorCustomComponent} from '../../../../shared/components/paginator-custom/paginator-custom.component';
import {AuthorizationService} from '../../../../core/services/authorization.service';
import {FileQueryDataSource} from '../../../../core/services/fileQuery-operations-datasource';
import {MatStepper} from '@angular/material';

@Component({
  selector: 'two-fileQuery-authorization-list',
  templateUrl: './fileQuery-authorization-list.component.html',
  styleUrls: ['./fileQuery-authorization-list.component.scss'],
  animations: [fadeInOut]
})

export class FileQueryAuthorizationListComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['select', 'operationFolio', 'fileName', 'clientID', 'clientName', 'chargeAccount',
    'operationDate', 'operationTime' , 'totalAmount', 'totalLines', 'ownAccounts', 'sabAccounts', 'otherBanks', 'chargeType', 'fileType', 'channel', 'operatorUser', 'status', 'folio'];
  dataSource: FileQueryDataSource;
  selection = new SelectionModel<FileQueryOperation>(false, []);
  @ViewChild(TwoPaginatorCustomComponent) paginator: TwoPaginatorCustomComponent;

  @Output() paginatorChange = new EventEmitter();
  @Output() selectionChange = new EventEmitter();
  @Input() stepper: MatStepper;

  itemSelected: any;

  constructor(private fileQueryService: FileQueryService, private authorizationService: AuthorizationService) {
  }

  ngOnInit() {
    this.dataSource = new FileQueryDataSource(this.fileQueryService, this.authorizationService);
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

