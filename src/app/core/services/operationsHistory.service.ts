import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {AppConfig} from '../../configs/app.config';

@Injectable({providedIn: 'root'})
export class OperationsHistoryService {

  totalFiles;
  totalPaymentItem;
  totalOperations = '';


  constructor(private http: HttpClient) {
  }

  getReferencedDepositHistory(data, pageNumber: number) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_SM_HISTORY/JSON/CUSTOM/0/ADAPTOR',
      {
    // !!form.clientID ? form.clientID : ''
        dateIni: !!data.dateFrom ? data.dateFrom : '',
        dateEnd: !!data.dateTo ? data.dateTo : '',
        clientID: !!data.clientID ? data.clientID : '',
        folio: !!data.folio ? data.folio : '',
        channel: !!data.channel ? data.channel : '',
        serviceType: 'RDWA',
        pageNumber: pageNumber,
        pageSize: 10
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        if (response.data !== '') {
          response.data = JSON.parse(response.data);
        }
        return response;
      }));
  }

  getReferencedDepositHistoryDetail(data) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_SM_HISTORY_DETAIL/JSON/CUSTOM/0/ADAPTOR',
      {
        // !!form.clientID ? form.clientID : ''
        date: !!data.date ? data.date : '',
        clientID: !!data.clientID ? data.clientID : '',
        folio: !!data.folio ? data.folio : '',
        channel: '',
        serviceType: 'RDWA'
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        if (response.data !== '') {
          response.data = JSON.parse(response.data);
        }
        return response;
      }));
  }

  getBeneficiariesHistory(data, pageNumber: number) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_BENEF_HISTORY/JSON/CUSTOM/0/ADAPTOR',
      {
        clientID: !!data.clientID ? data.clientID : '',
        benefAccount: !!data.benefAccount ? data.benefAccount : '',
        benefType: !!data.benefType ? data.benefType : '',
        pageNumber: pageNumber,
        pageSize: 10
        // serviceType: 'RDWA'
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }

  getBeneficiariesHistoryDetail(clientID, benefAccount, trackId) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_BENEF_HISTORY_DETAIL/JSON/CUSTOM/0/ADAPTOR',
      {
        clientID: !!clientID ? clientID : '',
        benefAccount: !!benefAccount ? benefAccount : '',
        trackId: !!trackId ? trackId : ''
        // serviceType: 'RDWA'
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }

}
