import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../configs/app.config';
import {map} from 'rxjs/operators';
import {GenericResponse} from '../../shared/models/generic-response.model';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class OperatorPldService {

  totalOperations = '';

  constructor(private http: HttpClient) {
  }

  getPldBeneficiaries(beneficiaryData, pageNumber: number) {
    localStorage.setItem('inProcess', 'inProcess');
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    const sessionID = sessionData.sessionID;
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_PLD_BENEFICIARY/JSON/CUSTOM/0/ADAPTOR',
      {
        clientId: !!beneficiaryData.client ? beneficiaryData.client : '',
        benefType: !!beneficiaryData.benefType ? beneficiaryData.benefType : '',
        status: !!beneficiaryData.status ? beneficiaryData.status : '',
        pageNumber: pageNumber,
        pageSize: 10
      }, {
        headers: {
          'sessionID': sessionID
        }
      }).pipe(
      map((response) => {
        localStorage.removeItem('inProcess');
        if (response.data[0].length > 0) {
          for (let i = 0; i < response.data[0].length; i++) {
            if (response.data[0][i].benefAccountType == '40' && response.data[0][i].benefAccountCurrency == 'MXN') {
              response.data[0][i].benefAccountType = '40';
            } else if (response.data[0][i].benefAccountType == '40' && response.data[0][i].benefAccountCurrency == 'USD') {
              response.data[0][i].benefAccountType = '41';
            }
          }
        }
        return response;
      }));
  }

  pldBeneficiary(data: any): Observable<GenericResponse> {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/PLD_BENEFICIARY/JSON/CUSTOM/0/ADAPTOR', data
    ).pipe(
      map((response) => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }

}
