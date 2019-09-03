import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatStepper} from '@angular/material';
import {OperatorPldService} from '../../../../core/services';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';
import {MODAL_SIZE} from '../../../../shared/helpers';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';

@Component({
  selector: 'two-beneficiaries-pld',
  templateUrl: './beneficiaries-pld.component.html',
  styleUrls: ['./beneficiaries-pld.component.scss']
})
export class BeneficiariesPldComponent implements OnInit {
  @Input()
  stepper: MatStepper;
  showSearchList = false;
  loading = false;
  formData: any;
  pageIndex = 1;
  noFoundMessage = 'errors.no-found';
  serviceData;
  initialForm = {
    benefType: 'N',
    client: '',
    status: 'IN_VALIDATION'
  };
  @Output() buttonClick = new EventEmitter();

  constructor(public operatorPldService: OperatorPldService, public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  getRows(formData, pageIndex, showDialog: boolean, refresh: boolean) {
    if (refresh) {
      this.showSearchList = false;
    }
    this.formData = formData;
    setTimeout(() => {
      this.loading = true;
    }, 0);
    this.operatorPldService.getPldBeneficiaries(formData, pageIndex).subscribe(response => {
      setTimeout(() => {
        this.loading = false;
      }, 0);
      if (response !== undefined) {
        if (response.errorCode !== '0') {
          if (showDialog) {
            const dialogRef = this.dialog.open(ErrorDialog, {
              width: MODAL_SIZE.width,
              height: MODAL_SIZE.height,
              disableClose: true,
              data: {error: 'errors.genericError'}
            });
          }
          this.showSearchList = false;
          return;
        }
        if (response.data[0].length == 0) {
          this.showSearchList = false;
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
        this.showSearchList = true;
      }
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

  getRowsPage(pageData) {
    this.pageIndex = pageData[0];
    this.getRows(this.formData, this.pageIndex, true, false);
  }

  refresh() {
    this.getRows(this.formData, this.pageIndex, false, true);
  }

  showSearch(show: boolean) {
    this.showSearchList = show;
  }

  onButtonClick(data) {
    this.buttonClick.emit(data);
  }
}
