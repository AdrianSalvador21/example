import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatStepper} from '@angular/material';
import {currentDate, MODAL_SIZE} from '../../../../shared/helpers';
import {AppConfig} from '../../../../configs/app.config';
import {OperationsHistoryService} from '../../../../core/services';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';
import {ReferencedPaymentFilterComponent} from '../../components/referenced-payment-filter/referenced-payment-filter.component';

@Component({
  selector: 'two-referenced-payment-history',
  templateUrl: './referenced-payment-history.component.html',
  styleUrls: ['./referenced-payment-history.component.scss']
})
export class ReferencedPaymentHistoryComponent implements OnInit {
  @ViewChild('filter') filter: ReferencedPaymentFilterComponent;
  @Input() stepper: MatStepper;
  actuallyPage = 1;
  formData;
  loading = false;
  showList = false;
  data;
  noFoundMessage = 'errors.no-found';

  constructor(public operationsHistoryService: OperationsHistoryService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getRows({
      channel: '',
      dateFrom: currentDate().subtract(1, 'days').format(AppConfig.dateFormat),
      dateTo: currentDate().subtract(1, 'days').format(AppConfig.dateFormat),
      clientID: ''
    }, false);
  }

  getRows(formData, showDialog: boolean, pageNumber?: number) {
    this.loading = true;
    this.formData = formData;
    this.formData.dateFrom = formData.dateFrom;
    this.formData.dateTo = formData.dateTo;
    if (pageNumber) {
      this.assignActuallyPage(pageNumber);
    } else {
      this.showList = false;
      this.assignActuallyPage();
    }

    this.operationsHistoryService.getReferencedDepositHistory(formData, this.actuallyPage).subscribe(response => {
      if (response.errorCode !== 0) {
        this.loading = false;
        this.showList = false;
        if (showDialog) {
          const dialogErroRef = this.dialog.open(ErrorDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {error: 'errors.genericError'}
          });
        }
        return;
      }

      if (response.data.length === 0 || response.data == '') {
        this.loading = false;
        this.showList = false;
        if (showDialog) {
          const dialogRef = this.dialog.open(MessageDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {message: this.noFoundMessage}
          });
        }
        return;
      }
      this.loading = false;
      this.data = response.data;
      this.showList = true;
    });
  }

  assignActuallyPage(pageNumber?: number) {
    if (pageNumber) {
      this.actuallyPage = pageNumber;
    } else {
      this.actuallyPage = 1;
    }
  }

  cleanForm() {
    this.filter.cleanFormInitial();
    this.getRows({
      channel: '',
      dateFrom: currentDate().subtract(1, 'days').format(AppConfig.dateFormat),
      dateTo: currentDate().subtract(1, 'days').format(AppConfig.dateFormat),
      clientID: ''
    }, false);
  }

  getRowsByPage(page) {
    this.getRows(this.formData, true, page);
  }

}
