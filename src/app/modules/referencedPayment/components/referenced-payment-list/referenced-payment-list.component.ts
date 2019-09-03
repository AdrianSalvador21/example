import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatStepper} from '@angular/material';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';
import {currentDate, MODAL_SIZE, scrollToTop} from '../../../../shared/helpers';
import {AppConfig} from '../../../../configs/app.config';
import {NewOperation} from '../../../../shared/models';
import {AuthorizationService} from '../../../../core/services/authorization.service';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';

@Component({
  selector: 'two-referenced-payment-list',
  templateUrl: './referenced-payment-list.component.html',
  styleUrls: ['./referenced-payment-list.component.scss']
})
export class ReferencedPaymentListComponent implements OnInit {
  @Input() listData;
  @Input() completeData;
  @Input() stepper: MatStepper;
  @Input() onHigh;

  @Output() clean = new EventEmitter();
  loading = false;

  constructor(public dialog: MatDialog, private authorizationService: AuthorizationService) { }

  ngOnInit() {
  }

  returnToFilter () {
    this.stepper.reset();
    scrollToTop();
  }

  continue() {
    this.clean.emit();
    let operationType;
    if (this.onHigh) {
      operationType = 'A';
    } else {
      operationType = 'B';
    }

    for (let i = 0; i < this.completeData.length; i++) {
      switch (this.completeData[i].MONEDA) {
        case 'MXN':
          this.completeData[i].MONEDA = '0';
          break;
        case 'USD':
          this.completeData[i].MONEDA = '101';
          break;
        case 'EUR':
          this.completeData[i].MONEDA = '97';
          break;
      }
    }

    const data = {
      'accounts': this.completeData,
      'total': this.completeData.length,
      'clientID': this.stepper['clientID'],
      'clientName': this.stepper['ordenantName'],
      'applicationDate': '',
      'applicationTime': ''
    };

    this.loading = true;
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    const additionals = JSON.stringify({
      folio: '',
      channel: 'ADAPTOR'
    });
    const operObj = <NewOperation> {
      operationGroup: 'REFERENCEDDEPOSIT',
      operationType: operationType,
      operationData: data,
      additionals: additionals,
      creatorUser: sessionData.username,
      creatorRol: sessionData.role,
      clientID: this.stepper['clientID'],
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
          data: {message: 'errors.authorization-required', folio: folio}
        });
        dialogRef.afterClosed().subscribe(result => {
          this.stepper.reset();
          scrollToTop();
        });
      } else {
        const dialogRef = this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: 'beneficiary.operator.filter.error.genericError'}
        });
      }
    });
  }

}
