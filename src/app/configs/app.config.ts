import {IAppConfig} from './iapp.config';

export var AppConfig: IAppConfig = {
  sessionLocalStorageKey: 'sessionData',
  useActiveDirectory: false,
  version: 'v1.03.24',
  routes: {
    authorization: {
      root: 'authorization',
      single: 'single',
      two: 'two'
    },
    beneficiaries: {
      root: 'beneficiaries',
      edition: 'edition',
      details: 'details',
      operation: 'operation',
      confirmNational: 'confirmNational',
      confirmInternational: 'confirmInternational'
    },
    fileQuery: {
      root: 'fileQuery',
      operator: 'operator',
      issues: 'issues',
      issueDetail: 'issueDetail',
      clarifications: 'clarifications',
      detail: 'detail'
    },
    massivePayments: {
      root: 'massivePayments',
      file: 'file'
    },
    operation: {
      root: 'operation',
      statusFull: 'statusFull',
      statusBasic: 'statusBasic'
    },
    history: {
      root: 'history',
      beneficiaries: 'beneficiaries',
      referencedDeposit: 'referencedPayment'
    },
    operator: {
      root: 'operator',
      pld: 'pld'
    },
    blockedTransactions: {
      root: 'blockedTransactions'
    },
    reportsModule: {
      root: 'reportsModule'
    },
    referencedPayment: {
      root: 'referencedPayment'
    },
    operationsModule: {
      root: 'operations'
    },
    collectionModule: {
      root: 'collection'
    },
    domiciliationModule: {
      root: 'domiciliation'
    },
    error404: '404',
    security: {
      root: 'security',
      login: 'login',
      userRoles: 'userRoles',
      roles: 'roles'
    }
  },
  endpoints: {
    dynamicServiceBroker: 'http://localhost:4200/DynamicServiceBroker/webapi/',
    sessionManager: 'http://localhost:4200/SecurityManager/AuthenticationManager/webapi/',
    uploadUrl: 'http://localhost:4200/AdministrationServices/Services/upload',
    reportGenerator: 'http://localhost:4200/reportGenerator-service/webapi/report/generateReportInBytes'
  },
  timeBetweenBatchVerification: 2000,
  batchVerificationTimeout: 18000000,
  sessionTime: 180,
  timeBeforeClose: 30,
  paths: {
    'reports': '/var/2innovateit/reports_src/'
  },
  reports: {
    'BATCH': 'RPT_Dispersion_Pagos.jasper',
    'BENEFICIARY-I': 'RPT_Beneficiario_Internacional.jasper',
    'BENEFICIARY-N': 'RPT_Beneficiario_Nacional.jasper',
    'BENEFICIARY-N-Alta': 'RPT_Beneficiario_Nacional_Alta_Historico.jasper',
    'UNITQUERY': 'RPT_Consulta_Unitaria.jasper',
    'FILEQUERY': 'RPT_Consulta_Archivo.jasper',
    'REFERENCEDDEPOSIT': 'RPT_Deposito_Referenciado.jasper',
    'FILEDETAIL': 'RTP_Detalle_Archivo.jasper',
    'HISTORYDETAIL': 'RPT_Solicitud_Alta_Baja_DR.jasper',
    'REQUESTDEPOSIT': 'RPT_Solicitud_Alta_Cuentas_DR.jasper'
  },
  dateFormat: 'DD/MM/YYYY',
  longTimeFormat: 'HH:mm:ss',
  timeFormat: 'HH:mm',
  isoDateFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
  dateAndTimeFormat: 'DD/MM/YYYY HH:mm:ss',
  dateAndTimeFormatTwo: 'YYYY-MM-DD HH:mm:ss',
  userName: {
    regex: new RegExp(/^[_\-0-9a-zA-Z]$/),
    maxLength: 40
  }
};
