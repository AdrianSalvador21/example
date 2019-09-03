import {Component, Input, OnInit} from '@angular/core';
import {fadeInOut, MODAL_SIZE} from '../../../../shared/helpers/index';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {LoggerService, MassivePaymentsService} from '../../../../core/services';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';

interface HAHeaderData {
  headerDescription: string;
  currency: string;
  debitAccount: string;
  amount: string;
  recordsNumber: string;
}

interface HBFooterData {
  headerDescription: string;
  amount: string;
  recordsNumber: string;
}

@Component({
  selector: 'two-massive-payment-details',
  templateUrl: './massive-payment-details.component.html',
  styleUrls: ['./massive-payment-details.component.scss'],
  animations: [fadeInOut]
})

export class MassivePaymentDetailsComponent extends BaseComponent implements OnInit {

  @Input()
  batchId: string;

  HA: HAHeaderData[];
  HBFooterData: HBFooterData;
  loading: boolean;
  openedAccordionId: string;
  filterApplied: boolean;
  filterName: string;
  filterAccountNumber: string;

  filterForm = this.fb.group({
    name: ['', [Validators.maxLength(40), Validators.pattern(this.regexAlphaNumericAndSpaces)]],
    accountNumber: ['', [Validators.minLength(10), Validators.maxLength(18), Validators.pattern(this.regexNumber)]]
  });

  constructor(private fb: FormBuilder, private massivePaymentsService: MassivePaymentsService, public dialog: MatDialog) {
    super();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.filterForm.controls;
  }

  ngOnInit() {
    this.loading = true;
    this.massivePaymentsService.getBatchHeaders(this.batchId)
      .subscribe((response) => {
          if (response.errorCode !== '0') {
            this.dialog.open(ErrorDialog, {
              width: MODAL_SIZE.width,
              height: MODAL_SIZE.height,
              disableClose: true,
              data: {error: 'errors.genericError'}
            });
            this.loading = false;
            return;
          }
          if (!response.data || !response.data[0] || !response.data[0][0]) {
            this.dialog.open(ErrorDialog, {
              width: MODAL_SIZE.width,
              height: MODAL_SIZE.height,
              disableClose: true,
              data: {error: 'errors.no-found'}
            });
            this.loading = false;
            return;
          }
          this.mapHAResponse(response);
          this.loading = false;
        }, (error) => {
          this.dialog.open(ErrorDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {error: 'errors.genericError'}
          });
          LoggerService.error(error.status);
          this.loading = false;
          return;
        }
      );
  }

  clean() {
    this.loading = true;
    this.filterApplied = false;
    this.filterForm.setValue({
      name: '',
      accountNumber: ''
    });
    this.filterName = undefined;
    this.filterAccountNumber = undefined;
    this.filterForm.markAsUntouched();
    setTimeout(() => {
      this.loading = false;
    }, 100);
  }

  mapHAResponse(response) {
    let data = response.data[0];
    this.HA = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].TIPOLINEA === 'HA') {
        let haRecord: HAHeaderData = {
          recordsNumber: data[i].CANTREGISTROS,
          debitAccount: data[i].CUENTACARGO,
          amount: data[i].IMPORTE,
          currency: data[i].MONEDA,
          headerDescription: data[i].TIPOLINEA
        };
        this.HA.push(haRecord);
      } else if (data[i].TIPOLINEA === 'HB') {
        this.HBFooterData = {
          recordsNumber: data[i].CANTREGISTROS,
          amount: data[i].IMPORTE,
          headerDescription: data[i].TIPOLINEA
        };
      } else {
        LoggerService.error('Tipo de linea no contemplado ' + data[i].TIPOLINEA);
      }
    }
  }

  onSubmit(values) {
    this.loading = true;
    this.filterApplied = true;
    this.filterName = values.name;
    this.filterAccountNumber = values.accountNumber;
    setTimeout(() => {
      this.loading = false;
    }, 100);
  }
}
