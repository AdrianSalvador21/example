import {OnInit, ViewChild} from '@angular/core';
import {currentDate, currentDateWithTime, MODAL_SIZE, scrollToTop} from '../../../../shared/helpers/utils.helper';
import {BeneficiaryAuthorizationListComponent} from '../../components/beneficiary-authorization-list';
import {Beneficiary} from '../../../../shared/models';
import {BeneficiaryService, LoggerService, MassivePaymentsService} from '../../../../core/services';
import {AuthModel} from '../../../../shared/models/auth.model';
import {AppConfig} from '../../../../configs/app.config';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {AuthorizationService} from '../../../../core/services/authorization.service';
import {BatchAuthorizationListComponent} from '../../components/batch-authorization-list';
import {ReferencedDepositAuthorizationListComponent} from '../../components/referencedDeposit-authorization-list';
import {IssuesAuthorizationListComponent} from '../../components/issues-authorization-list';
import {UnitQueryAuthorizationListComponent} from '../../components/unitQuery-authorization-list';
import {ClarificationAuthorizationListComponent} from '../../components/clarification-authorization-list';
import {FileQueryAuthorizationListComponent} from '../../components/fileQuery-authorization-list';
import {MatDialog, MatStepper} from '@angular/material';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';
import {BeneficiaryDetailsComponent} from '../../../beneficiaries/components/beneficiary-details';
import {AuthorizationFilterComponent} from '../../components/authorization-filter';
import * as moment from 'moment';

export class AuthorizationPageComponent extends BaseComponent implements OnInit {
  @ViewChild('filter') filter: AuthorizationFilterComponent;
  @ViewChild('beneficiaryList') beneficiaryList: BeneficiaryAuthorizationListComponent;
  @ViewChild('batchList') batchList: BatchAuthorizationListComponent;
  @ViewChild('referencedDepositList') referencedDepositList: ReferencedDepositAuthorizationListComponent;
  @ViewChild('issuesList') issuesList: IssuesAuthorizationListComponent;
  @ViewChild('unitQueryList') unitQueryList: UnitQueryAuthorizationListComponent;
  @ViewChild('clarificationList') clarificationList: ClarificationAuthorizationListComponent;
  @ViewChild('fileQueryList') fileQueryList: FileQueryAuthorizationListComponent;
  @ViewChild('details') details: BeneficiaryDetailsComponent;
  @ViewChild('stepper') stepper: MatStepper;

  selectedTab: string;
  message = 'general.operation-message';
  error;
  loading;
  operType = '';
  currentCreatorUser = '';
  currentClientID = '';
  currentFolio = '';
  currentDateFrom;
  currentDateTo;
  role;
  rawOperationIDs: any[];
  selectedItem;
  cantSignatures = '1';

  tabs = {
    BENEFICIARY: {
      show: false,
      label: 'authorization.beneficiary-tab-title'
    },
    BATCH: {
      show: false,
      label: 'authorization.batch-tab-title'
    },
    REFERENCEDDEPOSIT: {
      show: false,
      label: 'authorization.referencedDeposit-tab-title'
    },
    ISSUES: {
      show: false,
      label: 'authorization.issues-tab-title'
    },
    UNITQUERY: {
      show: false,
      label: 'authorization.unitQuery-tab-title'
    },
    CLARIFICATION: {
      show: false,
      label: 'authorization.clarification-tab-title'
    },
    FILEQUERY: {
      show: false,
      label: 'authorization.fileQuery-tab-title'
    }
  };


  beneficiary: Beneficiary;
  currentUser: string = '';

  allowContinue: boolean = false;
  authOrDenegate: boolean;
  dataFound: boolean = false;
  showClearButton: boolean = false;

  authErrorMessage: string = 'authorization.authErrorMessage';
  denegateErrorMessage: string = 'authorization.denegateErrorMessage';
  noDataFound: string = 'errors.no-found';
  noBeneficiaryFound: string = 'authorization.noBeneficiaryFound';

  detailsView: boolean = false;
  resumeView: boolean = false;

  fileLineDetails: boolean = true;
  showIssuesButtons: boolean = false;
  onTabsRefresh: boolean = false;

  showDetailBath = false;

  constructor(protected authorizationService: AuthorizationService,
              protected beneficiaryService: BeneficiaryService,
              protected massivePaymentService: MassivePaymentsService,
              public dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    this.currentUser = sessionData.username;
    this.currentCreatorUser = '';
    this.currentClientID = '';
    this.currentFolio = '';
    this.currentDateFrom = currentDate();
    this.currentDateTo = currentDate();
    this.stepper['status'] = 'PENDING';
    this.refreshResults(false, true);
  }

  onSubmit(form) {
    this.stepper['changeData'] = 'submitChange';
    this.selectedTab = undefined;
    this.currentCreatorUser = (form.operatorUser === null) ? '' : form.operatorUser;
    this.currentClientID = (form.clientID === null) ? '' : form.clientID;
    this.currentDateFrom = form.dateFrom;
    this.currentDateTo = form.dateTo;
    this.currentFolio = form.folio;
    this.refreshResults(false);
  }

  refreshResults(initialSearch: boolean, hideErrors?: boolean) {
    this.dataFound = false;
    this.showClearButton = false;
    this.loading = true;
    if (initialSearch) {
      this.currentCreatorUser = '';
      this.currentClientID = '';
      this.currentDateFrom = currentDate();
      this.currentDateTo = currentDate();
      this.stepper['status'] = 'PENDING';
      this.filter.resetFilter();
    }
    this.authorizationService.getOperationGroups(
      this.currentUser,
      this.currentCreatorUser,
      this.currentClientID,
      this.currentDateFrom,
      this.currentDateTo,
      'PENDING',
      this.currentFolio,
      this.cantSignatures
    ).subscribe((response) => {
      if ((response['errorCode'] !== '0' || response.length === 0) && hideErrors !== false) {
        if (hideErrors !== true) {
          this.dialog.open(MessageDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {message: this.noDataFound}
          });
        }
        this.loading = false;
        return;
      }
      this.dataFound = true;
      this.showClearButton = true;
      Object.keys(this.tabs).forEach((key) => {
        this.tabs[key].show = false;
        response.forEach((resp) => {
          if (resp.OPERATIONGROUP === key) {
            if (!this.selectedTab) {
              this.selectedTab = key;
            }
            this.tabs[key].show = true;
          }
        });
      });
      this.loading = false;
      this.refreshOperations(0);
    }, (err) => {
      if (hideErrors !== true) {
        this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: 'errors.genericError'}
        });
      }
      this.loading = false;
      return;
    });
  }

  onPaginatorChange() {
    if (!this.onTabsRefresh) {
      this.refreshOperations(0);
    }
  }

  selectionChange(item) {
    if (item && item !== null && item !== undefined) {
      this.allowContinue = true;
      this.selectedItem = item;
    }
  }

  onAuthClick(text: string) {
    switch (this.selectedTab) {
      case 'BENEFICIARY':
        if (this.beneficiaryList !== undefined && this.beneficiaryList !== null) {
          this.rawOperationIDs = this.beneficiaryList.selection.selected;
          this.doAuths('BENEFICIARY');
        }
        break;
      case 'BATCH':
        if (this.batchList !== undefined && this.batchList !== null) {
          this.rawOperationIDs = this.batchList.selection.selected;
          if (this.rawOperationIDs[0].statusBatch !== 'VALIDATED') {
            let text = 'authorization.authErrors.-49086';
            this.dialog.open(ErrorDialog, {
              width: MODAL_SIZE.width,
              height: MODAL_SIZE.height,
              disableClose: true,
              data: {error: text}
            });
          } else {
            this.doAuths('BATCH');
          }
        }
        break;
      case 'REFERENCEDDEPOSIT':
        if (this.referencedDepositList !== undefined && this.referencedDepositList !== null) {
          this.rawOperationIDs = this.referencedDepositList.selection.selected;
          this.doAuths('REFERENCEDDEPOSIT');
        }
        break;
      case 'ISSUES':
        break;
      case 'UNITQUERY':
        if (this.unitQueryList !== undefined && this.unitQueryList !== null) {
          this.rawOperationIDs = this.unitQueryList.selection.selected;
          this.doAuths('UNITQUERY');
        }
        break;
      case 'CLARIFICATION':
        break;
      case 'FILEQUERY':
        if (this.fileQueryList !== undefined && this.fileQueryList !== null) {
          this.rawOperationIDs = this.fileQueryList.selection.selected;
          this.doAuths('FILEQUERY');
        }
        break;
    }
  }

  doAuths(operationGroup: string) {
    const random: string = (Math.floor(Math.random() * 1000000)).toString();
    const dtISO: string = currentDateWithTime().format(AppConfig.isoDateFormat);
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    this.loading = true;
    let message = {};
    if (operationGroup === 'BATCH') {
      message = {
        'Header': {
          'Cliente': ''
        },
        'BatchId': this.rawOperationIDs[0].batchId,
        'Folio': this.rawOperationIDs[0].folio,
        'FechaCreacion': moment(this.rawOperationIDs[0].creationDate, AppConfig.isoDateFormat).format(AppConfig.dateFormat),
        'Estado': 'AUTHORIZE',
        'UsuarioAutorizador': sessionData.username
      };
    } else if (operationGroup === 'BENEFICIARY') {
      const isInter = this.beneficiary.internationalBeneficiary;
      if (this.operType === 'M') {
        message = {
          headerRQ: {
            msgId: random,
            timestamp: dtISO,
            channelRef: '',
            channelId: 'ADAPTOR',
            transactionType: 'BENEFICIARY.EN-M-OL-S'
          },
          messageRQ: {
            domainApp: 'BENEFICIARY',
            segmentId: 'BENEFICIARY',
            firstname: (this.beneficiary.personType === '00') ? this.beneficiary.localBeneficiaryData.legalReference : '',
            middlename: '',
            lastname: (this.beneficiary.personType === '00') ? this.beneficiary.localBeneficiaryData.firstLastName : '',
            lastname2: (this.beneficiary.personType === '00') ? this.beneficiary.localBeneficiaryData.secondLastName : '',
            companyName: (this.beneficiary.personType === '00') ? '' : this.beneficiary.localBeneficiaryData.legalReference,
            partyType: 'X',
            documentId: this.beneficiary.benefDocNumber,
            documentType: this.beneficiary.benefDocType,
            partyExternalId: this.beneficiary.clientNumber,
            documentCountry: this.beneficiary.benefDocCountry,
            citizenship: '',
            birthDay: '',
            phone: this.beneficiary.localBeneficiaryData.phone,
            email: this.beneficiary.localBeneficiaryData.email,
            gender: 'NA',
            alias: this.beneficiary.localBeneficiaryData.alias,
            accountNumber: this.beneficiary.beneficiaryAccountNumber,
            currency: (this.beneficiary.currency === 'MXN') ? '0' : ((this.beneficiary.currency === 'USD') ? '101' : '97'),
            branch: ' ',
            bankId: this.beneficiary.localBeneficiaryData.benefBank,
            accountType: this.beneficiary.beneficiaryAccountType === '41' ? '40' : this.beneficiary.beneficiaryAccountType,
            bankCountry: 'MX',
            beneficiaryType: (this.beneficiary.beneficiaryAccountType === '01') ? 'BENEFICIARY_IT' : 'BENEFICIARY_LW',
            additionals: {
              CURP: this.beneficiary.localBeneficiaryData.curp,
              MtoMax: this.beneficiary.localBeneficiaryData.maximumAmount,
              RazSoc: (this.beneficiary.personType === '00') ? '' : this.beneficiary.localBeneficiaryData.legalReference,
              Mail: this.beneficiary.localBeneficiaryData.email,
              IdAgenda: this.beneficiary.diaryId,
              TipPersona: this.beneficiary.personType,
              Apellido2: (this.beneficiary.personType === '00') ? this.beneficiary.localBeneficiaryData.secondLastName : '',
              Apellido1: (this.beneficiary.personType === '00') ? this.beneficiary.localBeneficiaryData.firstLastName : '',
              Motivo: this.beneficiary.localBeneficiaryData.reason,
              NroBeneficiario: this.beneficiary.benefNumber,
              Nombre: (this.beneficiary.personType === '00') ? this.beneficiary.localBeneficiaryData.legalReference : '',
              tipbenef: 'N',
              usuarioib: this.beneficiary.localBeneficiaryData.userIB,
              accion: 'M',
              TIPO_ALTA: 'I',
              FORMA_PAGO: (this.beneficiary.currency === 'MXN') ? 'CB' : 'CD',
              NroTelefono: this.beneficiary.localBeneficiaryData.phone,
              Justificacion: this.beneficiary.localBeneficiaryData.justification,
              operatorUser: this.rawOperationIDs[0].CREATORUSER,
              operationDate: this.rawOperationIDs[0].CREATIONDATE,
              authUser: sessionData.username,
              folio: this.rawOperationIDs[0].FOLIO,
              TipoRelacion: ''
            }
          }
        };
      } else {
        message = {
          headerRQ: {
            msgId: random,
            timestamp: dtISO,
            channelRef: '',
            channelId: 'ADAPTOR',
            transactionType: 'BENEFICIARY.EN-D-OL-S'
          },
          messageRQ: {
            clientId: this.beneficiary.clientNumber,
            benefDocType: this.beneficiary.benefDocType,
            benefDocNumber: this.beneficiary.benefDocNumber,
            benefDocCountry: this.beneficiary.benefDocCountry,
            benefAlias: (this.beneficiary.internationalBeneficiary) ? this.beneficiary.internationalBeneficiaryData.alias : this.beneficiary.localBeneficiaryData.alias,
            additionals: {
              Nro_benef: this.beneficiary.benefNumber,
              ID_Agenda: this.beneficiary.diaryId,
              usuarioib: (this.beneficiary.internationalBeneficiary) ? this.beneficiary.internationalBeneficiaryData.userIB : this.beneficiary.localBeneficiaryData.userIB,
              tipbenef: this.beneficiary.internationalBeneficiary ? 'I' : 'N',
              ctabenef: this.beneficiary.beneficiaryAccountNumber,
              numtel: (isInter) ? '' : this.beneficiary.localBeneficiaryData.phone,
              bancopart: (isInter) ? this.beneficiary.beneficiaryBankData.beneficiaryBank : '',
              tipcta: this.beneficiary.beneficiaryAccountType === '41' ? '40' : this.beneficiary.beneficiaryAccountType,
              SWF_BC: (isInter) ? this.beneficiary.beneficiaryBankData.bic : '',
              SWF_SBD: (isInter) ? ((this.beneficiary.intermediaryBankData.intermediaryBankBic === '') ? this.beneficiary.beneficiaryBankData.bic : this.beneficiary.intermediaryBankData.intermediaryBankBic) : '',
              //ADDITIONAL DATA FOR HISTORY
              CURP: this.beneficiary.localBeneficiaryData.curp,
              MtoMax: this.beneficiary.localBeneficiaryData.maximumAmount,
              RazSoc: (this.beneficiary.personType === '00') ? '' : this.beneficiary.localBeneficiaryData.legalReference,
              Mail: this.beneficiary.localBeneficiaryData.email,
              IdAgenda: this.beneficiary.diaryId,
              TipPersona: this.beneficiary.personType,
              Apellido2: (this.beneficiary.personType === '00') ? this.beneficiary.localBeneficiaryData.secondLastName : '',
              Apellido1: (this.beneficiary.personType === '00') ? this.beneficiary.localBeneficiaryData.firstLastName : '',
              Motivo: this.beneficiary.localBeneficiaryData.reason,
              NroBeneficiario: this.beneficiary.benefNumber,
              Nombre: (this.beneficiary.personType === '00') ? this.beneficiary.localBeneficiaryData.legalReference : '',
              accion: 'M',
              TIPO_ALTA: 'I',
              FORMA_PAGO: (this.beneficiary.currency === 'MXN') ? 'CB' : 'CD',
              NroTelefono: this.beneficiary.localBeneficiaryData.phone,
              Justificacion: this.beneficiary.localBeneficiaryData.justification,
              operatorUser: this.rawOperationIDs[0].CREATORUSER,
              operationDate: this.rawOperationIDs[0].CREATIONDATE,
              authUser: sessionData.username,
              folio: this.rawOperationIDs[0].FOLIO,
              TipoRelacion: ''
            },
            //ADDITIONAL DATA FOR HISTORY
            documentId: this.beneficiary.benefDocNumber,
            documentType: this.beneficiary.benefDocType,
            bankId: this.beneficiary.localBeneficiaryData.benefBank,
            accountType: this.beneficiary.beneficiaryAccountType === '41' ? '40' : this.beneficiary.beneficiaryAccountType,
            bankCountry: 'MX',
            beneficiaryType: (this.beneficiary.beneficiaryAccountType === '01') ? 'BENEFICIARY_IT' : 'BENEFICIARY_LW'
          }
        };
      }
    }
    if (operationGroup === 'REFERENCEDDEPOSIT') {

      this.rawOperationIDs[0].accounts.forEach((account) => {
        account['OperationDate'] = this.rawOperationIDs[0].CREATIONDATE;
      });

      message = {
        'Header': {
          'Cliente': this.rawOperationIDs[0].clientID,
          'Requerimiento': 'RDWA',
          'Usuario': this.rawOperationIDs[0].OPERATIONUSER,
          'Canal': 'ADAPTOR'
        },
        'cuentaClienteList': this.rawOperationIDs[0].accounts,
        'Folio': this.rawOperationIDs[0].folio,
        'UsuarioAutorizador': sessionData.username
      };
    }
    const authObj = <AuthModel>{
      authorizerUser: sessionData.username,
      authorizerRol: sessionData.role,
      appName: 'UNIVERSAL_CLIENT',
      operationGroup: operationGroup,
      operationType: this.rawOperationIDs[0].OPERATIONTYPE,
      operationID: this.rawOperationIDs[0].OPERATIONID,
      message: message
    };

    this.authorizationService.authOperation(authObj).subscribe((response) => {
      this.loading = false;
      if (response.errorCode === '0' || response.errorCode === '3') {
        if (response.errorCode === '0') {
          this.stepper['statusAuth'] = 'AUTHORIZED';
          if (operationGroup === 'BENEFICIARY') {
            if (!!this.beneficiary.internationalBeneficiaryData) {
              this.beneficiary.internationalBeneficiaryData.state = 'Autorizada';
            } else {
              this.beneficiary.localBeneficiaryData.state = 'Autorizada';
            }
          }
        } else {
          this.stepper['statusAuth'] = 'PENDING';
          const text = 'authorization.authErrors.more-signatures-required';
          this.dialog.open(MessageDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {message: text}
          });
        }
        if (operationGroup === 'BATCH') {
          this.retrieveBatchDetails();
        } else if (operationGroup === 'REFERENCEDDEPOSIT') {
          let responseAccounts = JSON.parse(response.data);
          let errorResponseAccounts = [];
          responseAccounts.forEach(account => {
            if (account.Codigo === '0') {
              errorResponseAccounts.push(account.CuentaCliente);
            }
          });
          this.stepper['errorAccounts'] = errorResponseAccounts;
          if (errorResponseAccounts.length !== 0) {
            const dialogRef = this.dialog.open(MessageDialog, {
              width: MODAL_SIZE.width,
              height: MODAL_SIZE.height,
              disableClose: true,
              data: {message: 'referencedPayment.detail.errorAccountMessage'}
            });

            dialogRef.afterClosed().subscribe((evt) => {
                this.detailsView = false;
                this.resumeView = true;
                this.stepper.next();
                scrollToTop();
              }
            );
          } else {
            this.detailsView = false;
            this.resumeView = true;
            this.stepper.next();
            scrollToTop();
          }
        } else {
          this.detailsView = false;
          this.resumeView = true;
          this.stepper.next();
          scrollToTop();
        }
        if (operationGroup === 'REFERENCEDDEPOSIT') {
          try {
            this.stepper['dataReferencedSelected']['folio'] = JSON.parse(response.data)['folio'];
            this.stepper['dataReferencedSelected']['channel'] = JSON.parse(response.data)['channel'];
          } catch {
            this.stepper['dataReferencedSelected']['folio'] = response.data;
          }
        }
      } else if (response.errorCode === '-49085' && operationGroup === 'BENEFICIARY') {
        this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: response.data['messageRS'].description}
        });
      } else {
        const text = 'authorization.authErrors.' + response.errorCode;
        this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: text}
        });
      }
    });
  }

  onDenegateClick(text: string) {
    switch (this.selectedTab) {
      case 'BENEFICIARY':
        if (this.beneficiaryList !== undefined && this.beneficiaryList !== null) {
          this.rawOperationIDs = this.beneficiaryList.selection.selected;
          this.doDenegations('BENEFICIARY');
        }
        break;
      case 'BATCH':
        if (this.batchList !== undefined && this.batchList !== null) {
          this.rawOperationIDs = this.batchList.selection.selected;
          this.doDenegations('BATCH');
        }
        break;
      case 'REFERENCEDDEPOSIT':
        if (this.referencedDepositList !== undefined && this.referencedDepositList !== null) {
          this.rawOperationIDs = this.referencedDepositList.selection.selected;
          this.doDenegations('REFERENCEDDEPOSIT');
        }
        break;
      case 'ISSUES':
        break;
      case 'UNITQUERY':
        if (this.unitQueryList !== undefined && this.unitQueryList !== null) {
          this.rawOperationIDs = this.unitQueryList.selection.selected;
          this.doDenegations('UNITQUERY');
        }
        break;
      case 'CLARIFICATION':
        break;
      case 'FILEQUERY':
        if (this.fileQueryList !== undefined && this.fileQueryList !== null) {
          this.rawOperationIDs = this.fileQueryList.selection.selected;
          this.doDenegations('FILEQUERY');
        }
        break;
    }
  }

  doDenegations(operationGroup: string) {
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    this.loading = true;
    let message = {};
    if (operationGroup === 'BATCH') {
      message = {
        'Header': {
          'Cliente': ''
        },
        'BatchId': this.rawOperationIDs[0].batchId,
        'Folio': this.rawOperationIDs[0].folio,
        'FechaCreacion': moment(this.rawOperationIDs[0].creationDate, AppConfig.isoDateFormat).format(AppConfig.dateFormat),
        'Estado': 'REJECTED',
        'UsuarioAutorizador': sessionData.username
      };
    }
    const rejectObj = <AuthModel>{
      authorizerUser: sessionData.username,
      authorizerRol: sessionData.role,
      appName: 'UNIVERSAL_CLIENT',
      operationGroup: operationGroup,
      operationType: this.rawOperationIDs[0].OPERATIONTYPE,
      operationID: this.rawOperationIDs[0].OPERATIONID,
      message: message
    };

    this.authorizationService.rejectOperation(rejectObj).subscribe((response) => {
      this.loading = false;
      if (response.errorCode === '0') {
        this.stepper['statusAuth'] = 'REJECTED';
        if (operationGroup === 'BENEFICIARY') {
          if (!!this.beneficiary.internationalBeneficiaryData) {
            this.beneficiary.internationalBeneficiaryData.state = 'Rechazado';
          } else {
            this.beneficiary.localBeneficiaryData.state = 'Rechazado';
          }
        }
        if (operationGroup === 'BATCH') {
          this.retrieveBatchDetails();
        } else {
          this.detailsView = false;
          this.resumeView = true;
          this.stepper.next();
          scrollToTop();
        }
      } else {
        this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: this.denegateErrorMessage}
        });
      }
    });
  }

  retrieveBatchDetails() {
    this.massivePaymentService.getControlValues(this.rawOperationIDs[0].nameFile).subscribe((response) => {
      this.stepper['controlValues'].userOperator = this.rawOperationIDs[0].userOperator;
      this.detailsView = false;
      this.resumeView = true;
      this.stepper.next();
      scrollToTop();
    });
  }

  onTabChange(obj) {
    this.stepper['changeData'] = 'tabChange';
    if (obj.index === -1) {
      this.onTabsRefresh = true;
      this.selectedTab = '';
      return;
    }
    this.onTabsRefresh = false;
    this.selectedTab = obj.tab.content.viewContainerRef.element.nativeElement.id;
    this.refreshOperations(0);
  }

  refreshOperations(attempts: number) {
    this.allowContinue = false;
    try {
      switch (this.selectedTab) {
        case 'BENEFICIARY':
          this.beneficiaryList.selection.clear();
          this.beneficiaryList.dataSource.loadOperations(
            'BENEFICIARY',
            this.currentUser,
            this.currentCreatorUser,
            this.currentClientID,
            this.currentDateFrom,
            this.currentDateTo,
            'PENDING',
            this.currentFolio,
            this.cantSignatures,
            this.beneficiaryList.paginator.pageIndex + 1,
            this.beneficiaryList.paginator.pageSize
          );
          break;
        case 'BATCH':
          this.batchList.selection.clear();
          this.batchList.dataSource.loadOperations(
            'BATCH',
            this.currentUser,
            this.currentCreatorUser,
            this.currentClientID,
            this.currentDateFrom,
            this.currentDateTo,
            'PENDING',
            this.currentFolio,
            this.cantSignatures,
            this.batchList.paginator.pageIndex + 1,
            this.batchList.paginator.pageSize
          );
          break;
        case 'REFERENCEDDEPOSIT':
          let pageIndex;
          if (this.referencedDepositList.paginator) {
            pageIndex = this.referencedDepositList.paginator.pageIndex + 1;
          } else {
            pageIndex = 1;
          }
          this.referencedDepositList.selection.clear();
          this.referencedDepositList.dataSource.loadOperations(
            'REFERENCEDDEPOSIT',
            this.currentUser,
            this.currentCreatorUser,
            this.currentClientID,
            this.currentDateFrom,
            this.currentDateTo,
            'PENDING',
            this.currentFolio,
            this.cantSignatures,
            pageIndex,
            10
          );
          break;
        case 'ISSUES':
          this.issuesList.selection.clear();
          this.issuesList.dataSource.loadOperations(
            'ISSUES',
            this.currentUser,
            this.currentCreatorUser,
            this.currentClientID,
            this.currentDateFrom,
            this.currentDateTo,
            'PENDING',
            this.currentFolio,
            this.cantSignatures,
            this.issuesList.paginator.pageIndex + 1,
            this.issuesList.paginator.pageSize
          );
          break;
        case 'UNITQUERY':
          this.unitQueryList.selection.clear();
          this.unitQueryList.dataSource.loadOperations(
            'UNITQUERY',
            this.currentUser,
            this.currentCreatorUser,
            this.currentClientID,
            this.currentDateFrom,
            this.currentDateTo,
            'PENDING',
            this.currentFolio,
            this.cantSignatures,
            this.unitQueryList.paginator.pageIndex + 1,
            this.unitQueryList.paginator.pageSize
          );
          break;
        case 'CLARIFICATION':
          this.clarificationList.selection.clear();
          this.clarificationList.dataSource.loadOperations(
            'CLARIFICATION',
            this.currentUser,
            this.currentCreatorUser,
            this.currentClientID,
            this.currentDateFrom,
            this.currentDateTo,
            'PENDING',
            this.currentFolio,
            this.cantSignatures,
            this.clarificationList.paginator.pageIndex + 1,
            this.clarificationList.paginator.pageSize
          );
          break;
        case 'FILEQUERY':
          this.fileQueryList.selection.clear();
          this.fileQueryList.dataSource.loadOperations(
            'FILEQUERY',
            this.currentUser,
            this.currentCreatorUser,
            this.currentClientID,
            this.currentDateFrom,
            this.currentDateTo,
            'PENDING',
            this.currentFolio,
            this.cantSignatures,
            this.fileQueryList.paginator.pageIndex + 1,
            this.fileQueryList.paginator.pageSize
          );
          break;
      }
    } catch (e) {
      console.log(e);
      if (attempts > 5) {
        LoggerService.error('No existe el view child de la lista para el tab: ' + this.selectedTab);
      } else {
        setTimeout(() => {
          this.refreshOperations(attempts++);
        }, 100);
      }
    }
  }

  continueToConfirmStep(showBatchDetail?: boolean) {
    this.loading = true;
    switch (this.selectedTab) {
      case 'BENEFICIARY':
        const benefSelection = this.beneficiaryList.selection.selected;
        this.rawOperationIDs = benefSelection;
        this.beneficiary = this.beneficiaryService.mapGetBeneficiary(benefSelection[0].OPERATIONDATA, true);

        this.beneficiary['operationType'] = benefSelection[0]['OPERATIONTYPE'];

        if (!!this.beneficiary.internationalBeneficiaryData) {
          this.beneficiary.internationalBeneficiaryData.state = 'Pendiente de autorización';
        } else {
          this.beneficiary.localBeneficiaryData.state = 'Pendiente de autorización';
        }
        this.stepper['statusAuth'] = 'PENDING';
        this.operType = benefSelection[0].OPERATIONTYPE;

        if (this.beneficiary.internationalBeneficiary) {
          this.beneficiaryService.getBeneficiaryDetail(this.beneficiary.clientNumber).subscribe(response => {
            const ordenantResponse = JSON.parse(response.data);
            this.beneficiary.ordenantData.address = `${ordenantResponse['CALLE']} ${ordenantResponse['NRO_PUERTA']}`;
            if (ordenantResponse.APARTAMENTO !== '') {
              this.beneficiary.ordenantData.address += ', ';
              this.beneficiary.ordenantData.address += ordenantResponse['APARTAMENTO'];
            }
            if (ordenantResponse.BARRIO !== '') {
              this.beneficiary.ordenantData.address += ', ';
              this.beneficiary.ordenantData.address += ordenantResponse['BARRIO'];
            }
            if (ordenantResponse.CODIGO_POSTAL !== '') {
              this.beneficiary.ordenantData.address += ', ';
              this.beneficiary.ordenantData.address += `C.P. ${ordenantResponse['CODIGO_POSTAL']}`;
            }
            this.beneficiary.ordenantData.city = `${ordenantResponse['LOCALIDAD']}, ${ordenantResponse['CIUDAD']}`;
            this.beneficiary.ordenantData.country = `${ordenantResponse['PAIS']}`;
            this.beneficiary.ordenantData.name = `${ordenantResponse['NOMBRE']}`;
            this.loading = false;

            this.detailsView = true;
            this.loading = false;
            this.stepper.next();
            scrollToTop();
          }, error => {
            this.loading = false;
            this.dialog.open(ErrorDialog, {
              width: MODAL_SIZE.width,
              height: MODAL_SIZE.height,
              disableClose: true,
              data: {error: 'errors.genericError'}
            });
          });
        } else {
          this.beneficiary['ordenantData'] = {
            address: '',
            city: '',
            country: '',
            name: this.stepper['ordererName']
          };

          this.detailsView = true;
          this.loading = false;
          this.stepper.next();
          scrollToTop();
        }
        break;
      case 'FILEQUERY':
        const fileQuerySelection = this.fileQueryList.selection.selected;
        this.stepper['fileSelected'] = fileQuerySelection[0];
        this.stepper['statusAuth'] = 'PENDING';
        this.detailsView = true;
        this.loading = false;
        this.stepper.next();
        scrollToTop();
        break;
      case 'UNITQUERY':
        const unitQuerySelection = this.unitQueryList.selection.selected;
        this.stepper['dataUnitQuerySelected'] = unitQuerySelection[0];
        this.stepper['statusAuth'] = 'PENDING';
        this.detailsView = true;
        this.loading = false;
        this.stepper.next();
        scrollToTop();
        break;
      case 'BATCH':
        const batchSelection = this.batchList.selection.selected;
        this.massivePaymentService.getControlValues(batchSelection[0].nameFile).subscribe((response) => {
          batchSelection[0].statusBatch = response.data[0][0].statusBatch;
          this.stepper['controlValues'] = batchSelection[0];
          this.stepper['statusAuth'] = 'PENDING';
          this.detailsView = true;
          this.showDetailBath = showBatchDetail;
          this.loading = false;
          this.stepper.next();
          scrollToTop();
        });
        break;

      case 'REFERENCEDDEPOSIT':
        const depositSelection = this.referencedDepositList.selection.selected;
        this.stepper['dataReferencedSelected'] = undefined;
        this.stepper['dataReferencedSelected'] = this.selectedItem;
        this.detailsView = true;
        this.loading = false;
        this.stepper.next();
        scrollToTop();
        break;
    }

  }

  authOrDenegateOperation() {
    if (this.authOrDenegate) {
      this.stepper['statusAuth'] = 'AUTHORIZED';
      this.onAuthClick('');
    } else {
      this.stepper['statusAuth'] = 'UNAUTHORIZED';
      this.onDenegateClick('');
    }
  }

  back() {
    this.stepper.previous();
    scrollToTop();
  }

  next() {
    this.stepper.next();
    scrollToTop();
  }

  finalize() {
    this.stepper['statusAuth'] = undefined;
    this.selectedTab = undefined;
    Object.keys(this.tabs).forEach((key) => {
      this.tabs[key].show = true;
    });
    this.stepper.reset();
    this.refreshResults(true, true);
    scrollToTop();
  }

  onClearClick() {
    this.showClearButton = false;
    this.dataFound = false;
  }
}
