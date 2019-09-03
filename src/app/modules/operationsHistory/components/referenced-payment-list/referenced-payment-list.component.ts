import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatStepper, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {Router} from '@angular/router';
import {scrollToTop} from '../../../../shared/helpers';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {OperationsHistoryService} from '../../../../core/services';

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
  selector: 'two-referenced-payment-history-list',
  templateUrl: './referenced-payment-list.component.html',
  styleUrls: ['./referenced-payment-list.component.scss']
})
export class ReferencedPaymentListComponent extends BaseComponent implements OnInit {

  data;
  total = 0;
  @Output() selectedItemEmitter = new EventEmitter();
  displayedColumns: string[] = ['select', 'channel', 'folio', 'applicationDate', 'clientID', 'name', 'operatorUser',
    'authUser', 'status'];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  selection = new SelectionModel<any>(true, []);
  pageData: Object;
  selectedItem: any = '';
  loading = false;
  @Input()
  stepper: MatStepper;
  @Output()
  pageEmitter = new EventEmitter();

  constructor(public router: Router, public operationsHistoryService: OperationsHistoryService) {
    super();
  }

  ngOnInit() {
  }

  @Input()
  set dataInput(value) {
    if (this.data == value)
      return;
    this.data = value;

    this.data.forEach(raw => {
      if (raw.CANAL !== '') {
        raw.CANAL = raw.CANAL.toLowerCase();
        if (raw.CANAL == 'adaptor') {
          raw.CANAL = 'Plataforma Transaccional';
        } else if (raw.CANAL == 'internet') {
          raw.CANAL = 'IB';
        }
      }
    });
    this.total = this.data[0].TOTAL;
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
    this.loading = true;
    const selectedData = {
      date: this.selectedItem.FECHA_APLICACION,
      clientID: this.selectedItem.CLIENTE,
      folio: this.selectedItem.FOLIO,
      channel: '',
    };


    this.operationsHistoryService.getReferencedDepositHistoryDetail(selectedData).subscribe(response => {
      this.loading = false;
      this.stepper['accountData'] = {
        accounts: response.data,
        channel: this.selectedItem.CANAL,
        FOLIO: this.selectedItem.FOLIO,
        applicationDate: this.selectedItem.ACCION === 'B' ? this.selectedItem.FECHA_CREACION : this.selectedItem.FECHA_APLICACION,
        clientID: this.selectedItem.CLIENTE,
        name: this.selectedItem.NOMBRE,
        OPERATIONUSER: this.selectedItem.USUARIO_OP,
        authUser: this.selectedItem.USUARIO_AUT,
        OPERATIONTYPE: this.selectedItem.ACCION,
        operationDate: this.selectedItem.OPERATION_DATE,
        clientName: this.selectedItem.NOMBRE,
        authDate: this.selectedItem.FECHA_CREACION
      };
      this.stepper.next();
      scrollToTop();
    });

  }

  assignRegister(item) {
    this.selectedItem = item;
  }

  emmitPage(page) {
    this.pageEmitter.emit(page.pageIndex + 1);
  }


}
