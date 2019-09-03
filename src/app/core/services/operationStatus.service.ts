import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {AppConfig} from '../../configs/app.config';
import {Observable} from 'rxjs';
import {BatchOperation, UnitQueryOperation} from '../../shared/models';
import * as moment from 'moment';
import {Moment} from 'moment';


@Injectable({providedIn: 'root'})
export class OperationStatusService {

  totalOperations = '';

  constructor(private http: HttpClient) {
  }

  getOperations(operationGroup: string, creatorUser: string, clientID: string,
                dateFrom: Moment, dateTo: Moment, folio: string, pageNumber: number, pageSize: number, authUser: string) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_OPER_STATUS/JSON/CUSTOM/0/ADAPTOR',
      {
        operationGroup: !!operationGroup ? operationGroup : '',
        creatorUser: !!creatorUser ? creatorUser : '',
        clientID: !!clientID ? clientID : '',
        dateFrom: dateFrom.format(AppConfig.dateFormat),
        dateTo: dateTo.format(AppConfig.dateFormat),
        folio: !!folio ? folio : '',
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        authuser: !!authUser ? authUser : ''
      })
      .pipe(map(response => {
        let operationsArray = [];
        if (!response.data || !response.data[0] || !response.data[0][0]) {
          return operationsArray;
        }
        this.totalOperations = response.data[0][0].total;
        localStorage.removeItem('inProcess');
        switch (operationGroup) {
          case 'BENEFICIARY':
            for (var i = 0; i < response.data[0].length; i++) {
              if (this.mapBenefOperations(response.data[0][i]) !== 'error') {
                operationsArray.push(this.mapBenefOperations(response.data[0][i]));
              }
            }
            break;
          case 'FILEQUERY':
            for (var i = 0; i < response.data[0].length; i++) {
              operationsArray.push(this.mapFileQueryOperations(response.data[0][i]));
            }
            break;
          case 'UNITQUERY':
            for (var i = 0; i < response.data[0].length; i++) {
              operationsArray.push(this.mapUnitQueryOperations(response.data[0][i]));
            }
            break;
          case 'BATCH':
            for (var i = 0; i < response.data[0].length; i++) {
              operationsArray.push(this.mapBatchOperations(response.data[0][i]));
            }
            break;
          case 'REFERENCEDDEPOSIT':
            for (var i = 0; i < response.data[0].length; i++) {
              operationsArray.push(this.mapReferencedPaymentOperations(response.data[0][i]));
            }
            break;
        }
        return operationsArray;
      }));
  }

  getOperationGroups(creatorUser: string, clientID: string,
                     dateFrom: Moment, dateTo: Moment, folio: String, authUser: string) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_OPER_STATUS_GROUPS/JSON/CUSTOM/0/ADAPTOR',
      {
        creatorUser: !!creatorUser ? creatorUser : '',
        clientID: !!clientID ? clientID : '',
        dateFrom: dateFrom.format(AppConfig.dateFormat),
        dateTo: dateTo.format(AppConfig.dateFormat),
        folio: !!folio ? folio : '',
        authuser: !!authUser ? authUser : ''
      }).pipe(
      map((response) => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }

  mapBenefOperations(rawData: any): any {
    let data = JSON.parse(rawData.OPERATIONDATA);
    let operDate = moment(rawData.CREATIONDATE);
    data.benefModificationDate = operDate.format(AppConfig.dateFormat);
    data.benefModificationTime = operDate.format(AppConfig.timeFormat);

    data['folio'] = rawData.FOLIO;

    if (rawData.FOLIO == undefined) {
      rawData['FOLIO'] = '';
    }

    let operation = {
      FOLIO: rawData.FOLIO,
      OPERATIONID: rawData.OPERATIONID,
      OPERATIONTYPE: rawData.OPERATIONTYPE,
      OPERATIONDATA: data,
      BENEFTYPE: data.benefType,
      BENEFACCOUNTTYPE: data.benefAccountType,
      PERSONTYPE: data.benefPersonType,
      IBUSER: data.IBUser,
      CLIENTID: rawData.CLIENTID,
      ORDERERNAME: data.ordererName,
      BENEFACCOUNT: data.benefAccountNumber,
      BENEFNAME: (data.benefName + ' ' + data.firstSurname + ' ' + data.secondSurname).trim(),
      CURRENCY: data.benefAccountCurrency,
      CREATORUSER: rawData.CREATORUSER,
      BENEFSTATUS: data.benefStatus,
      CREATIONDATE: rawData.CREATIONDATE,
      AUTHDATE: rawData.AUTHDATE,
      AUTHUSER: rawData.AUTHUSER,
      TOTAL: rawData.total
    };
    operation['OPERATIONSTATUS'] = rawData.STATUS;

    if (operation.BENEFACCOUNTTYPE == '40' && operation.CURRENCY == 'MX') {
      operation.BENEFACCOUNTTYPE = '40';
    } else if (operation.BENEFACCOUNTTYPE == '40' && operation.CURRENCY == 'USD') {
      operation.BENEFACCOUNTTYPE = '41';
    }
    return operation;
  }

  mapFileQueryOperations(rawData: any): any {
    let operation = JSON.parse(rawData.OPERATIONDATA);
    operation.OPERATIONID = rawData.OPERATIONID;
    operation.OPERATIONSTATUS = rawData.STATUS;
    operation.AUTHDATE = rawData.AUTHDATE;
    operation.CREATIONDATE = rawData.CREATIONDATE;
    operation.AUTHUSER = rawData.AUTHUSER;
    operation.CREATORUSER = rawData.CREATORUSER;
    operation.FOLIO = rawData.FOLIO;
    return operation;
  }

  mapUnitQueryOperations(rawData: any): UnitQueryOperation {
    let operation = JSON.parse(rawData.OPERATIONDATA);
    operation.OPERATIONID = rawData.OPERATIONID;
    operation.creatorUser = rawData.CREATORUSER;
    operation.OPERATIONSTATUS = rawData.STATUS;
    operation.AUTHDATE = rawData.AUTHDATE;
    operation.CREATORUSER = rawData.CREATORUSER;
    operation.AUTHUSER = rawData.AUTHUSER;
    operation.CREATIONDATE = rawData.CREATIONDATE;
    operation.FOLIO = rawData.FOLIO;
    return operation;
  }

  mapBatchOperations(rawData: any): BatchOperation {
    let operation = JSON.parse(rawData.OPERATIONDATA);
    operation.OPERATIONID = rawData.OPERATIONID;
    operation.additionals = rawData.ADDITIONALS;
    operation.OPERATIONSTATUS = rawData.STATUS;
    operation.NEXT_SIGNATURE = (<number>rawData.NEXT_SIGNATURE);
    //Dando vuelta las autorizaciones para que la primera sea la autorización final y la segunda la autorización por monto
    if (operation.NEXT_SIGNATURE > 1) {
      if (!!operation.AUTHUSER2) {
        operation.AUTHDATE = '';
        operation.AUTHUSER = '';
        operation.AUTHDATE2 = rawData.AUTHDATE2;
        operation.AUTHUSER2 = rawData.AUTHUSER2;
      } else {
        operation.AUTHDATE = rawData.AUTHDATE2;
        operation.AUTHUSER = rawData.AUTHUSER2;
        operation.AUTHDATE2 = rawData.AUTHDATE;
        operation.AUTHUSER2 = rawData.AUTHUSER;
      }
    } else {
      operation.AUTHDATE = rawData.AUTHDATE;
      operation.AUTHUSER = rawData.AUTHUSER;
      operation.AUTHDATE2 = rawData.AUTHDATE2;
      operation.AUTHUSER2 = rawData.AUTHUSER2;
    }

    operation.CREATORUSER = rawData.CREATORUSER;
    operation.CREATIONDATE = rawData.CREATIONDATE;
    operation.FOLIO = rawData.FOLIO;
    operation.BATCHINTERNALSTATUS = rawData.BATCHINTERNALSTATUS;
    return operation;
  }

  generateBase64Report(templateReport: string, reportToGenerate: string, reportFormat: string, data: any, contentType: string): Observable<any> {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post(AppConfig.endpoints.reportGenerator + '?templateReport=' + templateReport +
      '&reportToGenerate=' + reportToGenerate + '&reportFormat=' + reportFormat, data, {responseType: 'text'}).pipe(map(response => {
      localStorage.removeItem('inProcess');
      return this.transformBase64ToBlob(response, contentType);
    }));
  }

  transformBase64ToBlob(b64Data: any, contentType: string, sliceSize?: number) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    const byteCharacters = window.atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  mapReferencedPaymentOperations(rawData: any): any {
    let operation = {};

    try {
      operation = JSON.parse(rawData.OPERATIONDATA);
    } catch (e) {
      console.log(e);
    }

    try {
      operation['additionals'] = JSON.parse(rawData.ADDITIONALS);
      operation['folio'] = rawData.FOLIO;
      operation['channel'] = JSON.parse(rawData.ADDITIONALS)['channel'];
    } catch {
      operation['additionals'] = {folio: '', channel: ''};
      operation['folio'] = '';
      operation['channel'] = '';
    }
    if (!!rawData.FOLIO) {
      operation['FOLIO'] = rawData.FOLIO;
    } else {
      operation['FOLIO'] = operation['folio'];
    }
    operation['OPERATIONID'] = rawData.OPERATIONID;
    operation['OPERATIONSTATUS'] = rawData.STATUS;
    operation['OPERATIONTYPE'] = rawData.OPERATIONTYPE;
    operation['OPERATIONUSER'] = rawData.CREATORUSER;
    operation['STATUS'] = rawData.STATUS;
    operation['AUTHDATE'] = rawData.AUTHDATE;
    operation['AUTHUSER'] = rawData.AUTHUSER;
    operation['CREATORUSER'] = rawData.CREATORUSER;
    operation['CREATIONDATE'] = rawData.CREATIONDATE;
    return operation;
  }
}
