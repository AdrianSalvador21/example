import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {BaseComponent} from '../../../../../shared/components/base/base.component';
import {FileQueryService} from '../../../../../core/services/fileQuery.service';
import {TwoPaginatorCustomComponent} from '../../../../../shared/components/paginator-custom/paginator-custom.component';
import {LoggerService} from '../../../../../core/services';

export interface BeneficiaryItem {
  folio: string;
  ordererAccount: string;
  totalAmount: string;
  paymentType: string;
  operationType: string;
  rfcCurpOrderer: string;
  status: string;
}

@Component({
  selector: 'two-file-detail-payment-items-list',
  templateUrl: './fileDetail-paymentItems-list.component.html',
  styleUrls: ['./fileDetail-paymentItems-list.component.scss']
})

export class FileDetailPaymentItemsListComponent extends BaseComponent {

  batchIdInput;
  @Output() selectedItem = new EventEmitter();
  displayedColumns: string[] = ['folio-column', 'ordererAccount-column', 'totalAmount-column', 'paymentType-column', 'operationType-column', 'rfcCurpOrderer-column', 'status-column'];
  selection = new SelectionModel<any>(true, []);
  dataPayment;
  pageNumber = 1;
  showPaginator: boolean = false;
  showTable: boolean = false;
  totalPayment;
  loading: boolean = false;
  @Input() incomplete = false;
  @ViewChild(TwoPaginatorCustomComponent) paginator: TwoPaginatorCustomComponent;
  @Output() paginatorChange = new EventEmitter();
  @Input() onFile = false;

  constructor(private fileQueryService: FileQueryService) {
    super();
  }

  @Input()
  set batchInput(value) {
    if (this.batchIdInput === value)
      return;
    this.batchIdInput = value;
    this.batchIdInput = parseInt(this.batchIdInput);

    this.getPaymentList(this.batchIdInput, this.pageNumber);
  }

  getPaymentList(batchId, pageIndex) {
    this.loading = true;
    this.fileQueryService.paymentItems(batchId, pageIndex, 10).subscribe(response => {

      this.dataPayment = response;
      this.totalPayment = this.fileQueryService.totalPaymentItem;
      this.totalPayment = parseInt(this.totalPayment);
      this.loading = false;
      this.showTable = true;
    }, error => {
      LoggerService.error(error.status);
    });
  }

  changePage(page) {
    this.getPaymentList(this.batchIdInput, this.paginator.pageIndex + 1);
  }

  assignRegister(value, item) {
    this.selectedItem.emit(item);
  }
}
