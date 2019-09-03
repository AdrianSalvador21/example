import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';

@Injectable({providedIn: 'root'})
export class BlockedTransactionsService {

  totalOperations = '';
  fakeResponse = {
    errorCode: '0',
    msg: '',
    token: '',
    data: [
      [
        {
          'total': '15',
          'date': '09/07/2018',
          'service': '',
          'amount': '',
          'name': 'Federico Garcia',
          'ordenant': '',
          'documentType': 'RFC',
          'documentNumber': '2ddfsdf3dfd3g3f3f33f',
          'bank': '',
          'country': 'MX',
          'benefType': '01',
          'channel': '',
          'status': '',
          'authUser': '',
          'authDate': ''
        },
        {
          'total': '15',
          'date': '09/07/2018',
          'service': 'EJEMPLO',
          'amount': '345',
          'name': 'Federico Garcia',
          'ordenant': '',
          'documentType': 'RFC',
          'documentNumber': '2ddfsdf3dfd3g3f3f33f',
          'bank': '',
          'country': 'MX',
          'benefType': '01',
          'channel': '3435',
          'status': '',
          'authUser': '',
          'authDate': ''
        },
        {
          'total': '15',
          'date': '09/07/2018',
          'service': '',
          'amount': '98',
          'name': 'Federico Garcia',
          'ordenant': '',
          'documentType': 'RFC',
          'documentNumber': '2ddfsdf3dfd3g3f3f33f',
          'bank': '',
          'country': 'MX',
          'benefType': '01',
          'channel': '',
          'status': '',
          'authUser': '',
          'authDate': ''
        },
        {
          'total': '15',
          'date': '09/07/2018',
          'service': '',
          'amount': '23',
          'name': 'Federico Garcia',
          'ordenant': '',
          'documentType': 'RFC',
          'documentNumber': '2ddfsdf3dfd3g3f3f33f',
          'bank': '',
          'country': 'MX',
          'benefType': '01',
          'channel': '543534534',
          'status': '',
          'authUser': '',
          'authDate': ''
        },
        {
          'total': '15',
          'date': '09/07/2018',
          'service': '',
          'amount': '98',
          'name': 'Federico Garcia',
          'ordenant': '',
          'documentType': 'RFC',
          'documentNumber': '2ddfsdf3dfd3g3f3f33f',
          'bank': '',
          'country': 'MX',
          'benefType': '01',
          'channel': '',
          'status': '',
          'authUser': '',
          'authDate': ''
        }
      ]
    ]
  };

  constructor(private http: HttpClient) {
  }

  getBlockedTransactions(data, pageNumber: number): Observable<any> {
    return of(this.fakeResponse);
  }
}
