import {Component, Input, OnInit} from '@angular/core';
import {fadeInOut} from '../../../../shared/helpers/index';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {LoggerService, MassivePaymentsService} from '../../../../core/services';

export interface HaRecordData {
  operationDetail: string; //Detalle de las operaciones
  movementType: string //Tipo de Movimiento
  application: string; //Aplicación
  applicationDate: string; //Fecha de aplicación
  transactionType: string; //Tipo de Transacción
  debitAccount: string; //Cuenta de Cargo
  beneficiaryAccountType: string; //Tipo de cuenta del beneficiario
  creditAccount: string; //Cuenta de abono
  personType: string; //Tipo de Persona
  beneficiaryName: string; //Nombre del Beneficiario
  rfc: string; //RFC
  curp: string; //CURP
  currency: string; //Divisa
  amount: string; //Importe
  iva: string; //IVA
  concept: string; //Concepto
  reference: string; //Referencia
  email: string; //Correo electrónico de Beneficiario
  mobileNumber: string; //Número Celular
}

@Component({
  selector: 'two-massive-payment-ha-details',
  templateUrl: './massive-payment-ha-details.component.html',
  styleUrls: ['./massive-payment-ha-details.component.scss'],
  animations: [fadeInOut]
})

export class MassivePaymentHaDetailsComponent extends BaseComponent implements OnInit {
  @Input()
  batchId: string;
  @Input()
  debitAccount: string;
  @Input()
  creditAccount: string;
  @Input()
  name: string;
  loading: boolean;

  data: HaRecordData[];
  @Input()
  totalRecords: number;
  page: number = 0;

  displayedColumns = ['operationDetail', 'movementType', 'application', 'applicationDate', 'transactionType', 'debitAccount',
    'beneficiaryAccountType', 'creditAccount', 'personType', 'beneficiaryName', 'rfc', 'curp', 'currency', 'amount', 'iva',
    'concept', 'reference', 'email', 'mobileNumber'];
  error;

  constructor(private massivePaymentsService: MassivePaymentsService) {
    super();
  }

  ngOnInit() {
    this.getBatchHeadersLines();
  }

  getBatchHeadersLines() {
    this.loading = true;
    this.massivePaymentsService.getBatchHeadersLines(this.batchId, this.debitAccount, this.creditAccount, this.name, this.page)
      .subscribe((response) => {
          if (response.errorCode !== '0') {
            this.error = 'errors.genericError';
            this.loading = false;
            return;
          }
          if (!response.data || !response.data[0] || !response.data[0][0]) {
            this.error = 'errors.no-found';
            this.loading = false;
            return;
          }
          this.mapHALinesResponse(response);
          this.loading = false;
        }, (error) => {
          this.error = 'errors.genericError';
          LoggerService.error(error.status);
          this.loading = false;
          return;
        }
      );
  }

  mapHALinesResponse(response) {
    let data = response.data[0];
    this.data = [];
    for (let i = 0; i < data.length; i++) {
      let record: HaRecordData = {
        operationDetail: 'DE',
        application: data[i].Aplicacion,
        creditAccount: data[i].CUENTAABONO,
        debitAccount: data[i].CUENTACARGO,
        /*data[i].CUENTAPROPIAS,
        data[i].CUENTASTERCEROS,*/
        curp: data[i].CURP,
        mobileNumber: data[i].Celular,
        concept: data[i].Concepto,
        /*data[i].DESCRIPCIONERROR,*/
        email: data[i].Email,
        applicationDate: data[i].FechaAplicacion,
        /*data[i].IMPORTE,*/
        iva: data[i].IVA,
        /*data[i].LINEA,*/
        currency: data[i].MONEDA,
        amount: data[i].MONTO,
        beneficiaryName: data[i].NombreBeneficiario,
        /*data[i].OTROSBANCOS,
        data[i].PAYITEM,
        data[i].PAYORDER,*/
        rfc: data[i].RFC,
        /*data[i].RN,*/
        reference: data[i].Referencia,
        beneficiaryAccountType: data[i].TIPOCUENTAABONO,
        movementType: data[i].TipoMovimiento,
        personType: data[i].TipoPersona,
        transactionType: data[i].TipoTransaccion
      };
      this.data.push(record);
    }
  }

  changePage(page) {
    this.page = page;
    this.getBatchHeadersLines();
  }
}
