import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {BenefOperation} from '../../shared/models';
import {AuthorizationService} from './authorization.service';
import * as moment from 'moment';
import {Moment} from 'moment';
import {AppConfig} from '../../configs/app.config';

export class UnitQueryDataSource implements DataSource<BenefOperation> {

  private operationSubject = new BehaviorSubject<BenefOperation[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private operLength = new BehaviorSubject<number>(0);
  public length$ = this.operLength.asObservable();

  constructor(private authorizationService: AuthorizationService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<BenefOperation[]> {
    return this.operationSubject.asObservable();
  }

  getOperations(): BenefOperation[] {
    return this.operationSubject.getValue();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.operationSubject.complete();
    this.loadingSubject.complete();
  }

  loadOperations(operationGroup, currentUser, creatorUser: string, clientID: string, dateFrom: Moment, dateTo: Moment, status: string, folio: string, cantSignatures: string, pageNumber = 1, pageSize = 10) {

    this.loadingSubject.next(true);

    this.authorizationService.getOperations(operationGroup, currentUser, creatorUser, clientID, dateFrom, dateTo, status, folio, cantSignatures, pageNumber, pageSize).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(data => {
        data.forEach(raw => {
          if (raw.CREATIONDATE !== '') {
            raw['operationDate'] = moment(raw.CREATIONDATE, AppConfig.isoDateFormat).format(AppConfig.dateFormat);
            raw['operationTime'] = moment(raw.CREATIONDATE, AppConfig.isoDateFormat).format(AppConfig.longTimeFormat);
          }
          if (raw.AUTHDATE !== '') {
            raw['authDate'] = moment(raw.AUTHDATE, AppConfig.isoDateFormat).format(AppConfig.dateFormat);
            raw['authTime'] = moment(raw.AUTHDATE, AppConfig.isoDateFormat).format(AppConfig.longTimeFormat);
          }
        });

        this.operationSubject.next(data);
        this.operLength.next(parseInt(this.authorizationService.totalOperations));
      });
  }
}
