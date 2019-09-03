import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {AppConfig} from '../../configs/app.config';
import {BehaviorSubject, Observable} from 'rxjs';
import {NewOperation} from '../../shared/models';
import {GenericResponse} from '../../shared/models/generic-response.model';
import {currentDate, minDate} from '../../shared/helpers';

@Injectable({providedIn: 'root'})
export class MassivePaymentsService {

  totalOperations = '';
  batchPath = '';
  loading = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
  }

  uploadBatch(file: any): Observable<any> {
    localStorage.setItem('inProcess', 'inProcess');
    const formData = new FormData();
    formData.append('uploadedFile', file, file.name);
    return this.http.post(AppConfig.endpoints.uploadUrl, formData, {
      headers: {
        'X-File-Name': file.name,
        'X-File-Size': file.size,
        'X-File-Type': file.type
      },
      reportProgress: true
    }).pipe(map(value => {
      localStorage.removeItem('inProcess');
      return value;
    }));
  }

  getBatchPath(): Observable<string> {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_CUSTOM_PARAMETERS/JSON/CUSTOM/0/ADAPTOR', {
      clave10110: 'SABADELL',
      clave20110: 'UI',
      clave30110: 'BATCH_PATH'
    }).pipe(map(response => {
      localStorage.removeItem('inProcess');
      return response.data[0][0].VALOR10110;
    }));
  }

  getSPIDBeneficiary(): Observable<string> {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_CUSTOM_PARAMETERS/JSON/CUSTOM/0/ADAPTOR', {
      clave10110: 'SABADELL',
      clave20110: 'RELACION_SPID',
      clave30110: ''
    }).pipe(map(response => {
      localStorage.removeItem('inProcess');
      return response.data[0][0].VALOR10110;
    }));
  }

  initBatch(clientID: string, IBUser: string, token: string, tempFileName: string, fileName: string, chargeType: string, referencedAccount): Observable<GenericResponse> {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/INIT_BATCH/JSON/CUSTOM/0/ADAPTOR',
      {
        Header: {
          Canal: 'ADAPTOR',
          Token: token,
          Usuario: IBUser,
          Device: '',
          Requerimiento: '',
          Cliente: clientID
        },
        RutaArchivo: this.batchPath,
        NombreArchivo: tempFileName,
        NombreArchivoCliente: fileName,
        TipoCargo: chargeType,
        CuentaReferencia: referencedAccount,
        CantAutorizaciones: 'S',
        Contrato: clientID
      }).pipe(map(initResponse => {
      localStorage.removeItem('inProcess');
      return initResponse;
    }));
  }

  validateBatch(clientID: string, IBUser: string, token: string, tempFileName: string): Observable<GenericResponse> {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/VALIDATE_BATCH/JSON/CUSTOM/0/ADAPTOR',
      {
        Header: {
          Canal: 'ADAPTOR',
          Token: token,
          Usuario: IBUser,
          Device: '',
          Requerimiento: '',
          Cliente: clientID
        },
        Ruta: this.batchPath,
        Nombre: tempFileName,
        NombreArchivoCliente: tempFileName
      }).pipe(map(validationResponse => {
      localStorage.removeItem('inProcess');
      return validationResponse;
    }));
  }

  verifyUploadedFile(fileName: string): Observable<number> {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/VERIFY_UPLOADED_BATCH/JSON/CUSTOM/0/ADAPTOR', {
      fileName: fileName
    }).pipe(map((response) => {
      localStorage.removeItem('inProcess');
      return parseInt(response.data);
    }));
  }

  getControlValues(fileName: string): Observable<GenericResponse> {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/QUERY_BY_FILE/JSON/CUSTOM/0/ADAPTOR',
          {
        folio: '',
        fileName: fileName,
        dateFrom: minDate().format(AppConfig.dateFormat),
        dateTo: currentDate().format(AppConfig.dateFormat),
        accountCharge: '',
        status: '',
        pageNumber: 1,
        pageSize: 1
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }

  initOperation(obj: NewOperation): Observable<GenericResponse> {
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/INIT_OPERATION/JSON/CUSTOM/0/ADAPTOR', obj);
  }

  rejectBatch(obj: any): Observable<GenericResponse> {
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/REJECT_BATCH/JSON/CUSTOM/0/ADAPTOR', obj);
  }

  getBatchHeaders(batchId: string) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/DISPERSIONDETALLEHEADERS/JSON/CUSTOM/0/ADAPTOR',
      {
        batchId: batchId
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }

  getBatchHeadersLines(batchId: string, debitAccount: string, creditAccount: string, name: string, page: number) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/DISPERSIONDETALLELINEASHA/JSON/CUSTOM/0/ADAPTOR',
      {
        batchId: batchId,
        cuentaCargo: debitAccount,
        cuentaAbono: creditAccount ? creditAccount : '',
        benefName: name ? name : '',
        pagina: page + 1,
        resul_pagina: 10
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }
}
