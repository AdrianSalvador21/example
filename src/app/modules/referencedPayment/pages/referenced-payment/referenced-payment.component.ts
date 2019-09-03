import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatStepper} from '@angular/material';
import {ReferencedPaymentFilterComponent} from '../../components/referenced-payment-filter/referenced-payment-filter.component';
import {ReferencedPaymentService} from '../../../../core/services/referencedPayment.service';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {maxDate, minDate, MODAL_SIZE} from '../../../../shared/helpers';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';
import {AuthorizationService} from '../../../../core/services/authorization.service';
import {AppConfig} from '../../../../configs/app.config';
import {Router} from '@angular/router';

@Component({
  selector: 'two-referenced-payment',
  templateUrl: './referenced-payment.component.html',
  styleUrls: ['./referenced-payment.component.scss']
})
export class ReferencedPaymentComponent implements OnInit {
  @ViewChild('filter') filter: ReferencedPaymentFilterComponent;
  noFoundMessage = 'errors.no-found';
  accounts = [];
  onHigtOperation: boolean;
  showResult = false;
  loading = false;
  formData = [];
  selectedOption: any;
  selectedOperation = 'massivePayments.officeOperation.referencedDepositActions.';

  @Input() stepper: MatStepper;

  constructor(public referencedPaymentService: ReferencedPaymentService, public dialog: MatDialog, public authorizationService: AuthorizationService, public router: Router) {
    if (!localStorage.getItem('referencedDepositAction')) {
      this.router.navigate(['/' + AppConfig.routes.operationsModule.root]);
    }
    this.selectedOption = localStorage.getItem('referencedDepositAction');
    this.selectedOperation += this.selectedOption;
    localStorage.removeItem('referencedDepositAction');
  }

  ngOnInit() {
  }

  setOperation(onHigt: boolean) {
    this.onHigtOperation = onHigt;
  }

  getResults(formData) {
    this.accounts = [];
    this.showResult = false;
    this.loading = true;
    this.noFoundMessage = 'errors.no-found';
    this.referencedPaymentService.getReferencedPayments(formData).subscribe(response => {
      if (response.errorCode !== 0) {
        this.loading = false;
        const dialogRef = this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: 'errors.genericError'}
        });
        this.showResult = false;
        return;
      }

      this.accounts = JSON.parse(response.data).filter((elem) => {
        if (this.onHigtOperation) {
          return elem['SERVICIO_ACTIVO'] === '0' || elem['SERVICIO_ACTIVO'] === '2';
        } else {
          return elem['SERVICIO_ACTIVO'] === '1';
        }
      });
      if (this.accounts.length === 0) {
        this.loading = false;
        this.showResult = false;
        const dialogRef = this.dialog.open(MessageDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {message: this.noFoundMessage}
        });
        return;
      }

      this.authorizationService.getOperations('REFERENCEDDEPOSIT', '', '',
        formData.clientID, minDate(), maxDate(), 'PENDING', '', '1',
        1, 10000).subscribe(authResponse => {
        let pendingData;
        pendingData = !this.onHigtOperation ? authResponse.filter(item => item.OPERATIONTYPE === 'B') : authResponse.filter(item => item.OPERATIONTYPE === 'A');

        let pendingAccounts = [];
        pendingData.forEach((pendingOperation) => {
          pendingOperation.accounts.forEach((pendingAccount) => {
            pendingAccounts.push(pendingAccount.NUMERO);
          });
        });

        this.accounts.forEach((account) => {
          if (pendingAccounts.indexOf(account.NUMERO) > -1) {
            account['PENDING'] = true;
            account['PENDING_AUTH'] = true;
          } else if (account['SERVICIO_ACTIVO'] === '2') {
            account['PENDING'] = true;
            account['PENDING_AUTH'] = false;
          }
        });

        this.loading = false;
        this.showResult = true;
      });

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

  cleanFilter() {
    this.showResult = false;
    this.filter.cleanForm();
  }

  noData() {
    this.filter.noData();
  }

  noResultsClean(onHighOperation) {
    this.filter.cleanName();
    setTimeout(() => {
      this.showResult = false;

      if (onHighOperation) {
        this.noFoundMessage = 'errors.noHighResults';
      } else {
        this.noFoundMessage = 'errors.noDownResults';
      }

      const dialogRef = this.dialog.open(MessageDialog, {
        width: MODAL_SIZE.width,
        height: MODAL_SIZE.height,
        disableClose: true,
        data: {message: this.noFoundMessage}
      });
    }, 0);
  }

}
