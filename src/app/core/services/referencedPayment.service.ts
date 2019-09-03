import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../configs/app.config';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ReferencedPaymentService {

  fakeResponse = {
    errorCode: '0',
    msg: '',
    token: '',
    data: [
      {
        'NUMERO': '00000441107',
        'MONEDA': 'MXN',
        'TIPO_CUENTA': '01',
        'FECHA_ALTA': '09/07/2018',
        'ESTADO': 'Normal',
        'SALDO': '111821794649.88',
        'SERVICIO_ACTIVO': '1'
      },
      {
        'NUMERO': '00000441108',
        'MONEDA': '',
        'TIPO_CUENTA': 'MXN',
        'FECHA_ALTA': '09/07/2018',
        'ESTADO': 'Normal',
        'SALDO': '5432.39',
        'SERVICIO_ACTIVO': '0'
      },
      {
        'NUMERO': '000004411089',
        'MONEDA': '',
        'TIPO_CUENTA': 'MXN',
        'FECHA_ALTA': '09/07/2018',
        'ESTADO': 'Normal',
        'SALDO': '5432.39',
        'SERVICIO_ACTIVO': '1'
      },
      {
        'NUMERO': '00000441134',
        'MONEDA': '',
        'TIPO_CUENTA': 'MXN',
        'FECHA_ALTA': '09/07/2018',
        'ESTADO': 'Normal',
        'SALDO': '5432.39',
        'SERVICIO_ACTIVO': '1'
      },
      {
        'NUMERO': '00006741108',
        'MONEDA': '',
        'TIPO_CUENTA': 'MXN',
        'FECHA_ALTA': '09/07/2018',
        'ESTADO': 'Normal',
        'SALDO': '5432.39',
        'SERVICIO_ACTIVO': '1'
      }
    ]
  };

  constructor(private http: HttpClient) {
  }

  getReferencedPayments(data) {
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    const sessionID = sessionData.sessionID;
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/RD_GET_ACCOUNTS/JSON/CUSTOM/0/ADAPTOR',
      {
        Header: {
          Requerimiento: 'RDWA'
        },
        Cliente: data.clientID
      }, {
        headers: {
          'sessionID': sessionID
        }
      })
      .pipe(map(response => {
        return response;
      }));
  }

  getContractValidDispersion(data, serviceTypeData) {

    let serviceType;
    serviceType = serviceTypeData === '2' ? '10' : '1';
    console.log('Tipo de servicio' , serviceTypeData);
    console.log('Servicio' , serviceType);
    console.log(data.clientID);
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    const sessionID = sessionData.sessionID;
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/CONTRACT_VALID_DISPERSION/JSON/CUSTOM/0/ADAPTOR',
      {
        Header: {
          Requerimiento: 'RDWA'
        },
        cuenta: data.clientID,
        servicio: serviceType,
        tiposervicio: serviceTypeData
      }, {
        headers: {
          'sessionID': sessionID
        }
      })
      .pipe(map(response => {
        return response;
      }));
  }
}
