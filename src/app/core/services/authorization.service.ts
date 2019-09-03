import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {AppConfig} from '../../configs/app.config';
import {Observable} from 'rxjs';
import {AuthModel} from '../../shared/models/auth.model';
import {GenericResponse} from '../../shared/models/generic-response.model';
import {BatchOperation, BenefOperation, FileQueryOperation, NewOperation, UnitQueryOperation} from '../../shared/models';
import * as moment from 'moment';
import {Moment} from 'moment';
import {TranslateService} from '@ngx-translate/core';


@Injectable({providedIn: 'root'})
export class AuthorizationService {

  totalOperations = '';

  constructor(private http: HttpClient, private translateService: TranslateService) {
  }

  getOperations(operationGroup: string, currentUser: string, creatorUser: string, clientID: string,
                dateFrom: Moment, dateTo: Moment, status: string, folio: string, cantSignatures: string, pageNumber: number, pageSize: number): Observable<any[]> {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_OPERATIONS/JSON/CUSTOM/0/ADAPTOR',
      {
        operationGroup: !!operationGroup ? operationGroup : '',
        currentUser: !!currentUser ? currentUser : '',
        creatorUser: !!creatorUser ? creatorUser : '',
        clientID: !!clientID ? clientID : '',
        dateFrom: !!dateFrom ? dateFrom.format(AppConfig.dateFormat) : '',
        dateTo: !!dateTo ? dateTo.format(AppConfig.dateFormat) : '',
        status: !!status ? status : '',
        folio: !!folio ? folio : '',
        cant_signature: cantSignatures ? cantSignatures : '',
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString()
      })
      .pipe(map(response => {
        let operationsArray = [];
        if (response.data[0].length !== 0) {
          this.totalOperations = response.data[0][0].total;
          switch (operationGroup) {
            case 'BENEFICIARY':
              for (var i = 0; i < response.data[0].length; i++) {
                operationsArray.push(this.mapBenefOperations(response.data[0][i]));
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
        }
        localStorage.removeItem('inProcess');
        return operationsArray;
      }));
  }


  mapBenefOperations(rawData: any): BenefOperation {
    let data = JSON.parse(rawData.OPERATIONDATA);
    let operDate = moment(rawData.CREATIONDATE);
    data.benefModificationDate = operDate.format(AppConfig.dateFormat);
    data.benefModificationTime = operDate.format(AppConfig.timeFormat);

    if (rawData.FOLIO == undefined) {
      rawData['FOLIO'] = '';
    }

    let operation = {
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
      FOLIO: rawData.FOLIO
    };
    operation['OPERATIONSTATUS'] = rawData.STATUS;

    if (operation.BENEFACCOUNTTYPE == '40' && operation.CURRENCY == 'MX') {
      operation.BENEFACCOUNTTYPE = '40';
    } else if (operation.BENEFACCOUNTTYPE == '40' && operation.CURRENCY == 'USD') {
      operation.BENEFACCOUNTTYPE = '41';
    }
    return operation;
  }

  mapFileQueryOperations(rawData: any): FileQueryOperation {
    let operation = JSON.parse(rawData.OPERATIONDATA);
    operation.OPERATIONID = rawData.OPERATIONID;
    operation.OPERATIONSTATUS = rawData.STATUS;
    operation.AUTHDATE = rawData.AUTHDATE;
    operation.CREATIONDATE = rawData.CREATIONDATE;
    operation.CREATORUSER = rawData.CREATORUSER;
    operation.FOLIO = rawData.FOLIO;
    if (operation.channel !== '') {
      if (operation.channel.toLowerCase() === 'adaptor') {
        operation.channel = this.translateService.instant('general.adaptor-label');
      } else if (operation.channel.toLowerCase() === 'internet') {
        operation.channel = this.translateService.instant('general.ib-label');
      }
    }
    return operation;
  }

  mapUnitQueryOperations(rawData: any): UnitQueryOperation {
    let operation = JSON.parse(rawData.OPERATIONDATA);
    operation.OPERATIONID = rawData.OPERATIONID;
    operation.creatorUser = rawData.CREATORUSER;
    operation.OPERATIONSTATUS = rawData.STATUS;
    operation.AUTHDATE = rawData.AUTHDATE;
    operation.CREATIONDATE = rawData.CREATIONDATE;
    operation.FOLIO = rawData.FOLIO;
    if (operation.channel !== '') {
      if (operation.channel.toLowerCase() === 'adaptor') {
        operation.channel = this.translateService.instant('general.adaptor-label');
      } else if (operation.channel.toLowerCase() === 'internet') {
        operation.channel = this.translateService.instant('general.ib-label');
      }
    }
    return operation;
  }

  mapBatchOperations(rawData: any): BatchOperation {

    let operation = JSON.parse(rawData.OPERATIONDATA);
    operation.OPERATIONID = rawData.OPERATIONID;
    operation.additionals = rawData.ADDITIONALS;
    operation.OPERATIONSTATUS = rawData.STATUS;
    operation.AUTHDATE = rawData.AUTHDATE;
    operation.AUTHDATE = !!rawData.AUTHDATE ? moment(rawData.AUTHDATE, AppConfig.isoDateFormat).format(AppConfig.dateFormat) : '';
    operation.AUTHTIME = !!rawData.AUTHDATE ? moment(rawData.AUTHDATE, AppConfig.isoDateFormat).format(AppConfig.longTimeFormat): '';
    operation.AUTHUSER = rawData.AUTHUSER;
    operation.CREATIONDATE = rawData.CREATIONDATE;
    operation.FOLIO = rawData.FOLIO;
    if (operation.channel !== '') {
      if (operation.channel.toLowerCase() === 'adaptor') {
        operation.channel = this.translateService.instant('general.adaptor-label');
      } else if (operation.channel.toLowerCase() === 'internet') {
        operation.channel = this.translateService.instant('general.ib-label');
      }
    }
    return operation;
  }

  mapReferencedPaymentOperations(rawData: any): any {
    let operation = JSON.parse(rawData.OPERATIONDATA);
    operation.OPERATIONSTATUS = rawData.STATUS;
    operation.OPERATIONTYPE = rawData.OPERATIONTYPE;
    operation.OPERATIONUSER = rawData.CREATORUSER;
    operation.STATUS = rawData.STATUS;
    operation.AUTHDATE = rawData.AUTHDATE;
    operation.CREATIONDATE = rawData.CREATIONDATE;
    operation.OPERATIONID = rawData.OPERATIONID;
    operation.FOLIO = rawData.FOLIO;
    try {
      operation.additionals = JSON.parse(rawData.ADDITIONALS);
      operation.channel = operation.additionals.channel;
      if (operation.channel !== '') {
        if (operation.channel.toLowerCase() === 'adaptor') {
          operation.channel = this.translateService.instant('general.adaptor-label');
        } else if (operation.channel.toLowerCase() === 'internet') {
          operation.channel = this.translateService.instant('general.ib-label');
        }
      }
    } catch {
      operation.channel = '';
    }
    return operation;
  }

  getOperationGroups(currentUser: string, creatorUser: string, clientID: string,
                     dateFrom: Moment, dateTo: Moment, status: string, folio: string, cantSignatures): Observable<any[]> {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_OPERATION_GROUPS/JSON/CUSTOM/0/ADAPTOR',
      {
        currentUser: !!currentUser ? currentUser : '',
        creatorUser: !!creatorUser ? creatorUser : '',
        clientID: !!clientID ? clientID : '',
        dateFrom: !!dateFrom ? dateFrom.format(AppConfig.dateFormat) : '',
        dateTo: !!dateTo ? dateTo.format(AppConfig.dateFormat) : '',
        status: !!status ? status : '',
        folio: folio ? folio : '',
        cant_signature: cantSignatures ? cantSignatures : ''
      })
      .pipe(map(response => {

        let resp = response.data[0];
        resp.errorCode = response.errorCode;
        resp.msg = response.msg;
        resp.token = response.token;
        localStorage.removeItem('inProcess');
        return resp;
      }));
  }

  authOperation(auth: AuthModel): Observable<GenericResponse> {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/AUTH_OPERATION/JSON/CUSTOM/0/ADAPTOR', auth)
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }

  rejectOperation(rejectObj: AuthModel): Observable<GenericResponse> {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/REJECT_OPERATION/JSON/CUSTOM/0/ADAPTOR', rejectObj)
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }

  initOperation(obj: NewOperation): Observable<GenericResponse> {
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/INIT_OPERATION/JSON/CUSTOM/0/ADAPTOR', obj);
  }
}
