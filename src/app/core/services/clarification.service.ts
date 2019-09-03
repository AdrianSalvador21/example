import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {AppConfig} from '../../configs/app.config';
import {currentDate, minDate} from '../../shared/helpers';
import {of} from 'rxjs';

@Injectable({providedIn:  'root'})
export class ClarificationService {

  totalOperations = '';
  fakeResponse = {
    'errorCode': '0',
    'msg': '',
    'token': '',
    'data': [
      {
        'ModuloTrn': '',
        'Transaccion': '',
        'NroRel': '',
        'Rubro': '',
        'Cuenta': '',
        'Papel': '',
        'Ordinal': '',
        'Moneda': '',
        'SubOrdinal': '',
        'Importe': '4535345',
        'SucTrn': '',
        'Sucursal': '',
        'FecCont': '',
        'NomRub': '',
        'DebCre': '',
        'SubOper': '',
        'Operacion': ''
      },
      {
        'ModuloTrn': '',
        'Transaccion': '',
        'NroRel': '',
        'Rubro': '',
        'Cuenta': '',
        'Papel': '',
        'Ordinal': '',
        'Moneda': '',
        'SubOrdinal': '',
        'Importe': '4535345',
        'SucTrn': '',
        'Sucursal': '',
        'FecCont': '',
        'NomRub': '',
        'DebCre': '',
        'SubOper': '',
        'Operacion': ''
      },
      {
        'ModuloTrn': '',
        'Transaccion': '',
        'NroRel': '',
        'Rubro': '',
        'Cuenta': '',
        'Papel': '',
        'Ordinal': '',
        'Moneda': '',
        'SubOrdinal': '',
        'Importe': '4535345',
        'SucTrn': '',
        'Sucursal': '',
        'FecCont': '',
        'NomRub': '',
        'DebCre': '',
        'SubOper': '',
        'Operacion': ''
      }
    ]
  }

  constructor(private http:  HttpClient) {
  }

  getUnitQueries(unitQueryData, pageNumber:  number) {
    localStorage.setItem('inProcess', 'inProcess');
    const dateFrom = !!unitQueryData.dateFrom ? unitQueryData.dateFrom :  minDate();
    const dateTo = !!unitQueryData.dateTo ? unitQueryData.dateTo :  currentDate();
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_UNIT_QUERIES/JSON/CUSTOM/0/ADAPTOR',
      {
        reference:  !!unitQueryData.reference ? unitQueryData.reference :  '',
        cve_rastreo:  !!unitQueryData.cve_rastreo ? unitQueryData.cve_rastreo :  '',
        dateFrom:  dateFrom.format(AppConfig.dateFormat),
        dateTo:  dateTo.format(AppConfig.dateFormat),
        amount:  !!unitQueryData.amount ? unitQueryData.amount :  '',
        benefAccount:  !!unitQueryData.benefAccount ? unitQueryData.benefAccount :  '',
        clientName:  !!unitQueryData.clientName ? unitQueryData.clientName :  '',
        oderAccount:  !!unitQueryData.orderAccount ? unitQueryData.orderAccount :  '',
        pageNumber:  pageNumber,
        pageSize:  10
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');

        if (response.errorCode !== '0' && response.errorCode !== '') {
          return 'error';
        }
        const d = [];
        for (let i = 0; i < response.data[0].length; i++) {
          const data = response.data[0][i];
          const individualRegister = {
            Total:  data.total,
            batch:  data.batch,
            paymentItemID:  data.paymentItem,
            counterpartInstitution:  data.intermediaryBank,
            paymentType:  data.paymentType,
            concept:  data.concep,
            reference:  data.numericReference,
            texts:  data.status,
            justification:  data.justification,
            IVA:  data.ivaAmount,
            applicationDate:  data.operationDate,
            applicationTime: data.operationTime,
            trackingKey:  data.cve_rastreo,
            bank:  data.ordererBank,
            amount:  data.amount,
            folio:  data.folio,
            ordererAccountType:  data.ordererAccountType,
            ordererName:  data.ordererName,
            ordererAccount:  data.ordererAccount,
            ordererRFC:  data.ordererDocumentNumber,
            benefAccountType:  data.benefAccountType,
            benefName:  data.benefName,
            benefAccount:  data.benefAccount,
            benefRFC:  data.benefDocumentNumber,
            channel:  data.channel,
            service:  data.servicio,
            status:  data.status,
            currency:  data.currency,
            clientID: data.clientID,
            coreReference: data.coreReference,
            paymentOrder: data.paymentOrder
          };
          if (individualRegister.channel !== '') {
            individualRegister.channel = individualRegister.channel.toLowerCase();
            if (individualRegister.channel == 'adaptor') {
              individualRegister.channel = 'Plataforma Transaccional';
            } else if (individualRegister.channel == 'internet') {
              individualRegister.channel = 'IB';
            }
          }
          d.push(individualRegister);
        }
        return d;
      }));
  }

  getAccountingItems(trackingKey, trackingGroup, identifier) {
    localStorage.setItem('inProcess', 'inProcess');
    if (trackingKey == '' || trackingKey == null) {
      return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_ACCOUNTING_ENTRIES/JSON/CUSTOM/0/ADAPTOR',
        {
          trackingGroup: trackingGroup,
          identifier: identifier
        })
        .pipe(map(response => {
          localStorage.removeItem('inProcess');
          return response;
        }));
    } else {
      return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_ACCOUNTING_ENTRIES/JSON/CUSTOM/0/ADAPTOR',
        {
          trackingKey: trackingKey
        })
        .pipe(map(response => {
          localStorage.removeItem('inProcess');
          return response;
        }));
    }
  }
}
