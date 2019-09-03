import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatStepper} from '@angular/material';
import {BlockedTransactionsFilterComponent} from '../../components/blocked-transactions-filter/blocked-transactions-filter.component';
import {BlockedTransactionsService} from '../../../../core/services/blockedTransactions.service';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {MODAL_SIZE} from '../../../../shared/helpers';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';
import {formatDate} from '@angular/common';

@Component({
  selector: 'two-blocked-transactions',
  templateUrl: './blocked-transactions.component.html',
  styleUrls: ['./blocked-transactions.component.scss']
})
export class BlockedTransactionsComponent implements OnInit {
  @ViewChild('filter') filter: BlockedTransactionsFilterComponent;
  @Input() stepper: MatStepper;
  formData;
  pageNumber = 1;
  loading = false;
  showResult = false;
  noFoundMessage = 'errors.no-found';
  serviceData;
  initialSearch = {
    documentNumber: '',
    documentType: '',
    name: '',
    service: '',
    status: 'PENDING'
  };

  constructor(public blockedTransactionsService: BlockedTransactionsService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.getRows(this.initialSearch, false, true, true);
  }

  getRows(formData, showDialog: boolean, refresh: boolean, findToday: boolean) {
    this.loading = true;
    if (refresh) {
      this.showResult = false;
      this.pageNumber = 1;
    }
    this.formData = formData;
    if (findToday) {
      this.formData['dateFrom'] = formatDate(new Date(), 'dd/MM/yyyy', 'en-US');
      this.formData['dateTo'] = formatDate(new Date(), 'dd/MM/yyyy', 'en-US');
    } else {
      const currentDate = new Date();
      currentDate.setFullYear(currentDate.getFullYear() - 1);
      this.formData['dateFrom'] = formatDate(currentDate, 'dd/MM/yyyy', 'en-US');
      this.formData['dateTo'] = formatDate(new Date(), 'dd/MM/yyyy', 'en-US');
    }
    this.blockedTransactionsService.getBlockedTransactions(this.formData, this.pageNumber).subscribe(response => {
      this.loading = false;
      if (response.errorCode !== '0') {
        if (showDialog) {
          const dialogRef = this.dialog.open(ErrorDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {error: 'errors.genericError'}
          });
        }
        this.showResult = false;
        return;
      }

      if (response.data[0].length === 0) {
        this.showResult = false;
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
      this.serviceData = response.data[0];
      this.showResult = true;
    }, error => {
      if (showDialog) {
        const dialogRef = this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: 'errors.genericError'}
        });
      }
      this.loading = false;
    });
  }

  getRowsPage(pageNumber) {
    this.pageNumber = pageNumber;
    this.getRows(this.formData, true, false, false);
  }

  showResultEvent(show) {
    this.showResult = show;
  }

  finalizeEvent() {
    this.showResult = false;
    this.filter.clean();
  }

}
