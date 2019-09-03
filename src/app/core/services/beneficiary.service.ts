import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {AppConfig} from '../../configs/app.config';
import {Observable} from 'rxjs';
import {Beneficiary, NewOperation} from '../../shared/models';
import {GenericResponse} from '../../shared/models/generic-response.model';

@Injectable({providedIn: 'root'})
export class BeneficiaryService {

  totalOperations = '';
  errorCode = '';

  constructor(private http: HttpClient) {
  }

  getSPIDBeneficiary(): Observable<any> {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_CUSTOM_PARAMETERS/JSON/CUSTOM/0/ADAPTOR', {
      clave10110: 'SABADELL',
      clave20110: 'RELACION_SPID',
      clave30110: ''
    }).pipe(map(response => {
      localStorage.removeItem('inProcess');
      return response.data[0];
    }));
  }

  getBeneficiary(clientId: string, beneficiaryAlias: string, beneficiaryAccount: string, status: string, benefType: string, rawData?: boolean): Observable<Beneficiary> {
    localStorage.setItem('inProcess', 'inProcess');

    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_BENEFICIARY/JSON/CUSTOM/0/ADAPTOR',
      {
        clientId: !!clientId ? clientId : '',
        beneficiaryAlias: !!beneficiaryAlias ? beneficiaryAlias : '',
        beneficiaryAccount: !!beneficiaryAccount ? beneficiaryAccount : '',
        status: !!status ? status : '',
        benefType: !!benefType ? benefType : ''
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        if (rawData) {
          return response;
        } else {
          return this.mapGetBeneficiary(response);
        }
      }));
  }

  getBeneficiaryDetail(clientId: string) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_CUSTOMER_DATA/JSON/CUSTOM/0/ADAPTOR',
      {
        cliente: !!clientId ? clientId : '',
        token: '',
        data: ''
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }


  mapGetBeneficiary(response: any, readyToMap?: boolean): Beneficiary | any {

    let d: any;

    if (!readyToMap) {
      const data = response.data;
      if (!data || data.length !== 1 || !data[0] || data[0].length !== 1 || !data[0][0]) {
        return undefined;
      } else if (response.errorCode !== '0') {
        return response;
      }

      d = data[0][0];
    } else {
      d = response;
    }
    const beneficiary = {
      tipoRelacion: d.tipoRelacion,
      personType: (d.benefPersonType === '00' || d.benefPersonType === 'F') ? '00' : '01',
      beneficiaryAccountNumber: d.benefAccountNumber,
      currency: d.benefAccountCurrency,
      beneficiaryAccountType: (d.benefAccountType !== undefined) ? d.benefAccountType : '',
      internationalBeneficiary: d.benefType === 'I',
      clientNumber: d.ordererClient,
      benefDocType: d.benefDocType,
      benefDocNumber: d.benefDocNumber,
      benefDocCountry: d.benefDocCountry,
      benefNumber: d.benefNumber,
      benefStatus: d.benefStatus,
      diaryId: d.diaryId,
      benefCreationDate: d.benefCreationDate,
      benefCreationTime: d.benefCreationTime,
      operationType: '',
      beneficiaryBank: d.bankName,
      folio: d.folio,
      localBeneficiaryData: undefined,
      ordenantData: undefined,
      beneficiaryBankData: undefined,
      internationalBeneficiaryData: undefined,
      intermediaryBankData: undefined
    };
    if (!beneficiary.internationalBeneficiary) {
      beneficiary.localBeneficiaryData = {
        alias: !!d.benefAlias ? d.benefAlias : '',
        curp: (d.benefDocType === 'CURP') ? d.benefDocNumber : d.benefCURP,
        userIB: d.IBUser,
        email: !!d.benefEmail ? d.benefEmail : '',
        firstLastName: d.firstSurname,
        secondLastName: d.secondSurname,
        justification: !!d.benefJustification ? d.benefJustification : '',
        reason: d.benefReason,
        legalReference: !!d.benefName ? d.benefName : '',
        maximumAmount: !!d.benefMaxAmount ? d.benefMaxAmount : '',
        phone: d.benefPhone,
        rfc: (d.benefDocType === 'RFC') ? d.benefDocNumber : '',
        benefBank: d.benefBank,
        modificationDate: d.benefModificationDate,
        modificationTime: d.benefModificationTime,
        pendingModification: d.pending_modification,
        pendingCreation: d.pending_creation
      };
    } else {
      beneficiary.ordenantData = {
        name: d.ordererName,
        country: d.ordererCountry,
        address: d.ordererAddress,
        city: d.ordererCity
      };
      beneficiary.internationalBeneficiaryData = {
        accountType: '##',
        email: !!d.benefEmail ? d.benefEmail : '',
        beneficiaryAccount: d.benefAccountNumber,
        justification: !!d.benefJustification ? d.benefJustification : '',
        reason: d.benefReason,
        beneficiaryName: !!d.benefName ? d.benefName : '',
        currency: d.benefAccountCurrency,
        beneficiaryCountry: d.benefCountry,
        maximumAmount: d.benefMaxAmount,
        beneficiaryCity: d.benefCity,
        userIB: d.IBUser,
        personType: (d.benefPersonType === '00' || d.benefPersonType === 'F') ? '00' : '01',
        loadDate: d.benefCreationDate,
        beneficiaryAddress: d.benefAddress,
        loadTime: d.benefCreationTime,
        charges: d.charges,
        modificationDate: d.benefModificationDate,
        modificationTime: d.benefModificationTime,
        pendingModification: d.pending_modification,
        pendingCreation: d.pending_creation,
        alias: !!d.benefAlias ? d.benefAlias : '',
        intermediaryBank: d.interBank,
        intermediaryBankNo: '',
        intermediaryBankYes: ''
      };
      beneficiary.intermediaryBankData = {
        intermediaryBankBic: !!d.interBankSwiftCode ? d.interBankSwiftCode : '',
        beneficiaryCountry: !!d.interBankCountry ? d.interBankCountry : '',
        intermediaryBank: !!d.interBank ? d.interBank : '',
        beneficiaryCity: !!d.interBankCity ? d.interBankCity : '',
        beneficiaryAddress: d.interBankAddress ? d.interBankCity : ''
      };
      beneficiary.beneficiaryBankData = {
        bic: d.benefBankSwiftCode,
        country: d.benefBankCountry,
        beneficiaryBank: d.bankName,
        city: d.benefBankCity,
        address: d.benefBankAddress
      };
    }
    if (beneficiary.beneficiaryAccountType === '40' && beneficiary.currency === 'MXN') {
      beneficiary.beneficiaryAccountType = '40';
    } else if (beneficiary.beneficiaryAccountType === '40' && beneficiary.currency === 'USD') {
      beneficiary.beneficiaryAccountType = '41';
    }

    return beneficiary;
  }

  initOperation(obj: NewOperation): Observable<GenericResponse> {
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/INIT_OPERATION/JSON/CUSTOM/0/ADAPTOR', obj);
  }

}
