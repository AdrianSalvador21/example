import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {AppConfig} from '../../configs/app.config';
import {currentDate, maxDate, minDate} from '../../shared/helpers';

@Injectable({providedIn: 'root'})
export class IssuesService {

  totalOperations = '';
  totalIssues = '';
  codeError;

  constructor(private http: HttpClient) {
  }

  getIssues(issuesData, pageNumber) {
    localStorage.setItem('inProcess', 'inProcess');
    issuesData.dateFrom = !issuesData.dateFrom ? minDate() : issuesData.dateFrom;
    issuesData.dateTo = !issuesData.dateTo ? maxDate() : issuesData.dateTo;
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/CONSOLE_OF_INCIDENTS/JSON/CUSTOM/0/ADAPTOR',
      {
        reference: !!issuesData.reference ? issuesData.reference : '',
        cve_rastreo: !!issuesData.cve_rastreo ? issuesData.cve_rastreo : '',
        dateFrom: issuesData.dateFrom.format(AppConfig.dateFormat),
        dateTo: issuesData.dateTo.format(AppConfig.dateFormat),
        pageNumber: pageNumber,
        pageSize: 10
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        if (response.errorCode !== '0') {
          this.codeError = response.errorCode;
          return 'error';
        }
        const d = [];
        for (let i = 0; i < response.data[0].length; i++) {
          const data = response.data[0][i];
          const applicationFullDate = `${data.applicationDate} ${data.applicationTime}`;
          const operationFullDate = `${data.operationDate} ${data.operationTime}`;
          const individualRegister = {
            Total: data.Total,
            batch: data.batch,
            paymentItemID: data.paymentItem,
            counterpartInstitution: data.intermediaryBank,
            paymentType: data.paymentType,
            concept: data.concep,
            reference: data.numericReference,
            texts: data.status,
            justification: data.justification,
            IVA: data.ivaAmount,
            applicationFullDate: applicationFullDate,
            applicationDate: data.applicationDate,
            applicationTime: data.applicationTime,
            operationDate: data.operationDate,
            operationTime: data.operationTime,
            operationFullDate: operationFullDate,
            trackingKey: data.cve_rastreo,
            bank: data.ordererBank,
            amount: data.amount,
            folio: data.folio,
            ordererAccountType: data.ordererAccountType,
            ordererName: data.ordererName,
            ordererAccount: data.ordererAccount,
            ordererRFC: data.ordererDocumentNumber,
            benefAccountType: data.benefAccountType,
            benefName: data.benefName,
            benefAccount: data.benefAccount,
            benefRFC: data.benefDocumentNumber
          };
          d.push(individualRegister);

        }

        return d;
      }));
  }
}
