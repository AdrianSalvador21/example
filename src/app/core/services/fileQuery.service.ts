import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {AppConfig} from '../../configs/app.config';

@Injectable({providedIn: 'root'})
export class FileQueryService {

  totalFiles;
  totalPaymentItem;
  totalOperations = '';

  fakeResponse = {
    errorCode: '0',
    msg: '',
    token: '',
    data: [
      [
        {
          'creationDate': '09/07/2018',
          'batchStatus': 'OK',
          'eventName': 'Nombre evento',
          'processName': 'Descripcion proceso',
          'reason': ''
        },
        {
          'creationDate': '09/07/2018',
          'batchStatus': 'OK',
          'eventName': 'Nombre evento',
          'processName': 'Descripcion proceso',
          'reason': ''
        },
        {
          'creationDate': '09/07/2018',
          'batchStatus': 'OK',
          'eventName': 'Nombre evento',
          'processName': 'Descripcion proceso',
          'reason': ''
        },
        {
          'creationDate': '09/07/2018',
          'batchStatus': 'OK',
          'eventName': 'Nombre evento',
          'processName': 'Descripcion proceso',
          'reason': ''
        },
        {
          'creationDate': '09/07/2018',
          'batchStatus': 'ERROR',
          'eventName': 'Nombre evento',
          'processName': 'Descripcion proceso',
          'reason': ''
        }
      ]
    ]
  };

  constructor(private http: HttpClient) {
  }

  getFiles(fileData, pageNuber: number) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/QUERY_BY_FILE/JSON/CUSTOM/0/ADAPTOR',
      {
        folio: !!fileData.folio ? fileData.folio : '',
        fileName: !!fileData.fileName ? fileData.fileName : '',
        dateFrom: fileData.dateFrom.format(AppConfig.dateFormat),
        dateTo: fileData.dateTo.format(AppConfig.dateFormat),
        accountCharge: !!fileData.accountCharge ? fileData.accountCharge : '',
        status: !!fileData.status ? fileData.status : '',
        pageNumber: pageNuber,
        pageSize: 10
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        if (response.errorCode !== '0') {
          return 'error';
        }
        if (response.data[0].length !== 0) {
          this.totalFiles = response.data[0][0].Total;
        }
        for (let i = 0; i < response.data[0].length; i++) {
          if (response.data[0][i].channel !== '') {
            response.data[0][i].channel = response.data[0][i].channel.toLowerCase();
            if (response.data[0][i].channel == 'adaptor') {
              response.data[0][i].channel = 'Plataforma Transaccional';
            } else if (response.data[0][i].channel == 'internet') {
              response.data[0][i].channel = 'IB';
            }
          }
        }
        return response.data[0];
      }));
  }


  paymentItems(batchId: number, pageNumber: number, pageSize: number) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_PAYMENT_ITEM/JSON/CUSTOM/0/ADAPTOR',
      {
        batchId: batchId,
        pageNumber: pageNumber,
        pageSize: pageSize
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        this.totalPaymentItem = response.data[0][0].total;
        const data = [];
        for (let i = 0; i < response.data[0].length; i++) {
          const unitItem = response.data[0][i];
          unitItem['benefRFC'] = response.data[0][i]['benefRFC/CURP'];
          unitItem['ordererRFC'] = response.data[0][i]['ordererRFC/CURP'];
          data.push(unitItem);
        }
        return data;
      }));
  }

  trackingItems(batchId: number, pageNumber: number) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_TRACKING_INFO/JSON/CUSTOM/0/ADAPTOR',
      {
        externalId: batchId,
        pageNumber: pageNumber,
        pageSize: '1000000000'
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }
}
