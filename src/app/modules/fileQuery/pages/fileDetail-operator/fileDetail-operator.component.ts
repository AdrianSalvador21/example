import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {fadeInOut, MODAL_SIZE, scrollToTop} from '../../../../shared/helpers/utils.helper';
import {FileQueryOperatorListComponent} from '../../components/fileQuery/fileQuery-operator-list';
import {MatDialog, MatStepper} from '@angular/material';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {FormBuilder} from '@angular/forms';
import {AppConfig} from '../../../../configs/app.config';
import {NewOperation} from '../../../../shared/models';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {AuthorizationService} from '../../../../core/services/authorization.service';
import {FileQueryService, LoggerService} from '../../../../core/services';

@Component({
  selector: 'two-fileDetail-operator',
  templateUrl: './fileDetail-operator.component.html',
  styleUrls: ['./fileDetail-operator.component.scss'],
  animations: [fadeInOut]
})

export class FileDetailOperatorComponent extends BaseComponent implements OnInit {
  @Input()
  stepper: MatStepper;

  @Input()
  hideTitle: boolean;
  @Input()
    onFile: boolean = false;

  fileSelected;
  batchId;
  selectedItem;
  allowContinue: boolean;
  incomplete: boolean;
  trackingList;
  noFoundMessage = 'errors.no-found';
  reportData;

  @Output() onContinueClick = new EventEmitter();

  @Input() showDetails: boolean = true;
  @Input() showButtons: boolean;
  @Input() onOperationStatus: boolean;
  @Input() onModify: boolean;
  @Input() onAuthDetails: boolean;
  @Input() showTrackingList: boolean = false;
  paymentForm = this.fb.group({
    showPaymentToggle: [false],
  });
  error;
  loading;
  showPaymentModify: boolean = false;
  @ViewChild('list') list: FileQueryOperatorListComponent;
  @Output() refresh = new EventEmitter();
  @Output() backClick = new EventEmitter();
  initOperationOk = 'fileQuery.issues.initOperationOk';
  initOperationError = 'beneficiary.operator.filter.error.genericError';

  constructor(private fb: FormBuilder, private authorizationService: AuthorizationService, private dialog: MatDialog, private fileQueryService: FileQueryService) {
    super();
  }

  @Input()
  set fileSelectedInput(value) {
    if (this.fileSelected === value)
      return;
    this.fileSelected = value;
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    this.allowContinue = (sessionData.username === this.fileSelected.userOperator) && this.fileSelected.statusBatch === 'UNCOMPLETED';
    this.incomplete = (sessionData.username === this.fileSelected.userOperator) && this.fileSelected.statusBatch === 'UNCOMPLETED';
    // this.allowContinue = this.fileSelected.statusBatch === 'UNCOMPLETED';
    this.batchId = value.batchId;
    if (this.onAuthDetails) {
      return;
    } else {
      this.getTracking(this.batchId);
    }
  }

  ngOnInit(): void {
  }

  getTracking(batchId: any) {
    this.loading = true;
    this.fileQueryService.trackingItems(batchId, 1).subscribe(response => {
      this.loading = false;
      if (response.errorCode !== '0') {
        const dialogRef = this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: 'errors.genericError'}
        });
        this.showTrackingList = false;
        return;
      }
      if (response.data[0].length === 0) {
        return;
      }
      this.trackingList = response.data[0];
      this.showTrackingList = true;
    }, error => {
      const dialogRef = this.dialog.open(ErrorDialog, {
        width: MODAL_SIZE.width,
        height: MODAL_SIZE.height,
        disableClose: true,
        data: {error: 'errors.genericError'}
      });
      this.loading = false;
    });
  }

  showPayment() {
    if (this.paymentForm.value.showPaymentToggle) {
      this.showPaymentModify = false;
      this.selectedItem = false;
    } else {
      this.showPaymentModify = true;
    }
  }

  onPISelection(item) {
    this.selectedItem = item;
    this.allowContinue = true;
  }

  continue() {
    this.stepper['fileStatus'] = this.incomplete;
    this.stepper['lineSelected'] = this.selectedItem;
    this.stepper['fileSelected'] = this.fileSelected;
    this.onContinueClick.emit();
  }

  finalize() {
    this.loading = true;
    let sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    let operObj = <NewOperation>{
      operationGroup: 'FILEQUERY',
      operationType: 'DETAILS',
      operationData: this.fileSelected,
      additionals: '',
      creatorUser: sessionData.username,
      creatorRol: sessionData.role,
      clientID: '',
      benefAccount: '',
      operationAmount: -1,
      operationCurrency: ''
    };
    this.authorizationService.initOperation(operObj).subscribe((response) => {
      this.loading = false;
      if (response.errorCode === '0') {
        let folio = '';
        if (!!response.data) {
          folio = response.data.folio;
        }
        const dialogRef = this.dialog.open(MessageDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {message: this.initOperationOk, folio: folio}
        });
        dialogRef.afterClosed().subscribe(result => {
          this.stepper.reset();
          scrollToTop();
          this.refresh.emit();
        });
      } else {
        const dialogRef = this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: this.initOperationError}
        });
      }
    });
  }

  onBackClick() {
    this.backClick.emit();
    this.selectedItem = false;
  }

  getPaymentList(batchId, pageIndex) {
    this.loading = true;
    this.fileQueryService.paymentItems(batchId, pageIndex, 10000).subscribe(response => {
      this.loading = false;
      this.reportData = this.fileSelected;
      for (let i = 0; i < response.length; i++) {
        if (response[i].benefRFC == undefined) {
          response[i].benefRFC = '';
        }
        if (response[i].ordererRFC == undefined) {
          response[i].ordererRFC = '';
        }

        response[i]['currency'] = this.fileSelected.currency;
        response[i]['client'] = this.fileSelected.client;
        response[i]['nameFile'] = this.fileSelected.client;
        response[i]['accountCharge'] = this.fileSelected.accountCharge;
      }
      this.reportData['listDataDetail'] = response;
    }, error => {
      LoggerService.error(error);
    });
  }

  onDownloadClick() {
    this.getPaymentList(this.batchId, 1);
  }
}
