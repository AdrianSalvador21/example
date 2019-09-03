export interface Beneficiary {
  personType: string;
  beneficiaryAccountNumber: string;
  currency: string;
  beneficiaryAccountType: string;
  internationalBeneficiary: boolean;
  clientNumber: string;
  benefDocType: string;
  tipoRelacion: string;
  benefDocNumber: string;
  benefDocCountry: string;
  benefNumber: string;
  benefStatus: string;
  benefCreationDate: string;
  benefCreationTime: string;
  diaryId: string;
  operationType: string;
  folio: string;
  localBeneficiaryData: LocalBeneficiary;
  ordenantData: Ordenant;
  beneficiaryBankData: BeneficiaryBank;
  internationalBeneficiaryData: InternationalBeneficiary;
  intermediaryBankData: IntermediaryBank;
}

export interface LocalBeneficiary {
  alias: string;
  legalReference: string;
  firstLastName: string;
  secondLastName: string;
  rfc: string;
  curp: string;
  userIB: string;
  email: string;
  phone: string;
  justification: string;
  maximumAmount: string;
  state: string;
  benefBank: string;
  modificationDate: string;
  modificationTime: string;
  pendingModification: string;
  pendingCreation: string;
  reason: string;
}

export interface Ordenant {
  name: string;
  country: string;
  address: string;
  city: string;
}

export interface BeneficiaryBank {
  bic: string;
  country: string;
  beneficiaryBank: string;
  city: string;
  address: string;
}

export interface InternationalBeneficiary {
  alias: string;
  accountType: string;
  email: string;
  beneficiaryAccount: string;
  justification: string;
  beneficiaryName: string;
  currency: string;
  beneficiaryCountry: string;
  maximumAmount: string;
  beneficiaryCity: string;
  userIB: string;
  personType: string;
  loadDate: string;
  beneficiaryAddress: string;
  loadTime: string;
  IVA: string;
  modificationDate: string;
  modificationTime: string;
  pendingModification: string;
  pendingCreation: string;
  intermediaryBank: string;
  intermediaryBankNo: string;
  intermediaryBankYes: string;
  state: string;
}

export interface IntermediaryBank {
  intermediaryBankBic: string;
  beneficiaryCountry: string;
  intermediaryBank: string;
  beneficiaryCity: string;
  beneficiaryAddress: string;
}

export interface BenefOperation {
  OPERATIONID: string;
  OPERATIONTYPE: string;
  OPERATIONDATA: any;
  BENEFTYPE: string;
  BENEFACCOUNTTYPE: string;
  PERSONTYPE: string;
  IBUSER: string;
  CLIENTID: string;
  ORDERERNAME: string;
  BENEFACCOUNT: string;
  BENEFNAME: string;
  CURRENCY: string;
  CREATORUSER: string;
  BENEFSTATUS: string;
}

export interface NewOperation {
  operationGroup: string;
  operationType: string;
  operationData: any;
  additionals: any;
  creatorUser: string;
  creatorRol: string;
  clientID: string;
  benefAccount: string;
  operationAmount: number;
  operationCurrency: string;
}
