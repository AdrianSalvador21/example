import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatStepper} from '@angular/material';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {MODAL_SIZE} from '../../../../shared/helpers';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';
import {ReferencedPaymentFilterComponent} from '../../components/referenced-payment-filter/referenced-payment-filter.component';
import {OperationsHistoryService} from '../../../../core/services';

@Component({
  selector: 'two-beneficiaries-history',
  templateUrl: './beneficiaries-history.component.html',
  styleUrls: ['./beneficiaries-history.component.scss']
})
export class BeneficiariesHistoryComponent implements OnInit {
  @ViewChild('filter') filter: ReferencedPaymentFilterComponent;
  @Input() stepper: MatStepper;

  actuallyPage = 1;
  formData;
  loading = false;
  showList = false;
  data;
  noFoundMessage = 'errors.no-found';

  constructor(public operationsHistoryService: OperationsHistoryService, public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  getRows(formData, showDialog: boolean, pageNumber?: number) {
    this.loading = true;
    this.formData = formData;
    if (pageNumber) {
      this.assignActuallyPage(pageNumber);
    } else {
      this.showList = false;
      this.assignActuallyPage();
    }

    this.operationsHistoryService.getBeneficiariesHistory(formData, this.actuallyPage).subscribe(response => {
      if (response.errorCode !== '0') {
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
      if (!!this.data && !!this.data[0]) {
        this.data[0].forEach((benef) => {
          if (benef.channel === 'Internet') {
            benef.operatorUser = benef.authUser;
            benef.authUser = '';
          }
        });
      }
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

  getRowsByPage(page) {
    this.getRows(this.formData, true, page);
  }

  clearData() {
    this.showList = false;
  }

}
