import {OnInit, ViewChild} from '@angular/core';
import {BeneficiaryAuthorizationListComponent} from '../../../authorization/components/beneficiary-authorization-list';
import {BatchAuthorizationListComponent} from '../../../authorization/components/batch-authorization-list';
import {ReferencedDepositAuthorizationListComponent} from '../../../authorization/components/referencedDeposit-authorization-list';
import {IssuesAuthorizationListComponent} from '../../../authorization/components/issues-authorization-list';
import {UnitQueryAuthorizationListComponent} from '../../../authorization/components/unitQuery-authorization-list';
import {ClarificationAuthorizationListComponent} from '../../../authorization/components/clarification-authorization-list';
import {FileQueryAuthorizationListComponent} from '../../../authorization/components/fileQuery-authorization-list';
import {BeneficiaryDetailsComponent} from '../../../beneficiaries/components/beneficiary-details';
import {MatDialog, MatStepper} from '@angular/material';
import {Beneficiary, Profile} from '../../../../shared/models';
import {AuthorizationService} from '../../../../core/services/authorization.service';
import {BeneficiaryService, OperationStatusService} from '../../../../core/services';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {currentDate, MODAL_SIZE, scrollToTop} from '../../../../shared/helpers';

export class OperationStatusComponent implements OnInit {

  @ViewChild('beneficiaryList') beneficiaryList: BeneficiaryAuthorizationListComponent;
  @ViewChild('batchList') batchList: BatchAuthorizationListComponent;
  @ViewChild('referencedDepositList') referencedDepositList: ReferencedDepositAuthorizationListComponent;
  @ViewChild('issuesList') issuesList: IssuesAuthorizationListComponent;
  @ViewChild('unitQueryList') unitQueryList: UnitQueryAuthorizationListComponent;
  @ViewChild('clarificationList') clarificationList: ClarificationAuthorizationListComponent;
  @ViewChild('fileQueryList') fileQueryList: FileQueryAuthorizationListComponent;
  @ViewChild('details') details: BeneficiaryDetailsComponent;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('filter') filter: any;

  // @ViewChild('filterBasic') filterBasic: OperationStatusFilterComponent;

  itemSelected: any = '';
  selectedTab: string;
  error;
  loading;
  operType: string = '';
  currentClientID = '';
  currentDateFrom;
  currentDateTo;
  currentFolio;
  role;
  operationData: any;
  showDownload = false;

  tabsToShow = {
    BENEFICIARY: false,
    BATCH: false,
    REFERENCEDDEPOSIT: false,
    ISSUES: false,
    UNITQUERY: false,
    CLARIFICATION: false,
    FILEQUERY: false
  };

  beneficiary: Beneficiary;
  creatorUser: string = '';
  authUser: string = '';

  allowContinue: boolean = false;
  onAuthDetails: boolean = true;
  authOrDenegate: boolean;
  dataFound: boolean = false;
  showClearButton: boolean = false;

  authErrorMessage: string = 'authorization.authErrorMessage';
  denegateErrorMessage: string = 'authorization.denegateErrorMessage';
  noDataFound: string = 'errors.no-found';
  noBeneficiaryFound: string = 'authorization.noBeneficiaryFound';

  detailsView: boolean = false;
  resumeView: boolean = false;

  showFileQueryDetails: boolean = false;
  fileLineDetails: boolean = true;

  pageNumber = 1;

  total = 0;

  constructor(protected authorizationService: AuthorizationService,
              public operationStatusService: OperationStatusService,
              protected beneficiaryService: BeneficiaryService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.initialSearch();
  }

  initialSearch() {
    Object.keys(this.tabsToShow).forEach((key) => {
      this.tabsToShow[key] = false;
    });
    this.pageNumber = 1;
    // realizar format de fechas
    this.currentDateTo = currentDate();
    this.currentDateFrom = currentDate();
    this.currentFolio = '';
    this.selectedTab = undefined;
    this.itemSelected = '';
    this.authUser = '';
    this.creatorUser = !!this.creatorUser ? this.creatorUser : '';
    this.pageNumber = 1;
    this.refreshResults(false);
    if (!!this.filter) {
      this.filter.cleanFormInitial();
    }
  }

  OnSubmit(form) {
    this.selectedTab = undefined;
    this.pageNumber = 1;
    this.currentClientID = !!form.clientID ? form.clientID : '';
    this.currentFolio = !!form.folio ? form.folio : '';
    this.currentDateFrom = form.dateFrom;
    this.currentDateTo = form.dateTo;
    this.creatorUser = !!form.creatorUser ? form.creatorUser : this.creatorUser;
    this.authUser = !!form.authUser ? form.authUser : this.authUser;
    this.itemSelected = '';
    this.pageNumber = 1;
    this.refreshResults(true);
  }

  refreshResults(showDialog: boolean) {
    this.dataFound = false;
    this.loading = true;
    this.showClearButton = true;
    if (this.currentClientID == null) {
      this.currentClientID = '';
    }
    this.operationStatusService.getOperationGroups(
      this.creatorUser,
      this.currentClientID,
      this.currentDateFrom,
      this.currentDateTo,
      this.currentFolio,
      this.authUser
    ).subscribe((response) => {
      if (response.errorCode !== '0') {
        if (showDialog) {
          const dialogRef = this.dialog.open(ErrorDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {error: 'errors.genericError'}
          });
        }
        this.loading = false;
        return;
      }
      this.loading = false;
      if (response['data'][0].length == 0) {
        if (showDialog) {
          const dialogRef = this.dialog.open(MessageDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {message: this.noDataFound}
          });
        }
        this.dataFound = false;
        this.showClearButton = false;
        return;
      }
      this.dataFound = true;
      this.showClearButton = true;
      Object.keys(this.tabsToShow).forEach((key) => {
        this.tabsToShow[key] = false;
        for (let i = 0; i < response['data'][0].length; i++) {
          if (response['data'][0][i].OPERATIONGROUP === key) {
            this.tabsToShow[key] = true;
            if (!this.selectedTab) {
              this.selectedTab = key;
            }
          }
        }
      });
      this.refreshOperations();
    }, error => {
      if (showDialog) {
        this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: 'errors.genericError'}
        });
      }
      this.loading = false;
    });
  }


  getResults(operationType) {
    this.loading = true;
    this.operationStatusService.getOperations(operationType, this.creatorUser, this.currentClientID, this.currentDateFrom, this.currentDateTo, this.currentFolio, this.pageNumber, 10, this.authUser).subscribe(response => {
      this.total = parseInt(this.operationStatusService.totalOperations);
      this.loading = false;
      switch (this.selectedTab) {
        case 'BENEFICIARY':
          this.stepper['beneficiaryListData'] = response;
          break;
        case 'BATCH':
          this.stepper['batchListData'] = response;
          break;
        case 'REFERENCEDDEPOSIT':
          this.stepper['referencedListData'] = response;
          break;
        case 'ISSUES':
          this.stepper['issuesListData'] = response;
          break;
        case 'UNITQUERY':
          this.stepper['unitListData'] = response;
          break;
        case 'CLARIFICATION':
          this.stepper['clarificationListData'] = response;
          break;
        case 'FILEQUERY':
          this.stepper['fileListData'] = response;
          break;
      }
    });
  }

  refreshOperations() {
    this.allowContinue = false;

    switch (this.selectedTab) {
      case 'BENEFICIARY':
        this.getResults('BENEFICIARY');
        break;
      case 'BATCH':
        this.getResults('BATCH');
        break;
      case 'REFERENCEDDEPOSIT':
        this.getResults('REFERENCEDDEPOSIT');
        break;
      case 'ISSUES':
        this.getResults('ISSUES');
        break;
      case 'UNITQUERY':
        this.getResults('UNITQUERY');
        break;
      case 'CLARIFICATION':
        this.getResults('CLARIFICATION');
        break;
      case 'FILEQUERY':
        this.getResults('FILEQUERY');
        break;
    }
  }

  onTabChange(obj) {
    if (obj.index === -1) {
      this.selectedTab = '';
      return;
    }
    this.pageNumber = 1;
    this.itemSelected = '';
    this.selectedTab = obj.tab.content.viewContainerRef.element.nativeElement.id;
    this.refreshOperations();
  }

  OnPaginatorChange(page) {
    this.pageNumber = page;
    this.refreshOperations();
  }

  SelectionChange(item) {
    if (item && item !== null && item !== undefined) {
      this.allowContinue = true;
    }
  }

  continueToConfirmStep() {
    this.loading = true;
    switch (this.selectedTab) {
      case 'BENEFICIARY':
        this.stepper['benefOperationStatus'] = this.itemSelected.OPERATIONSTATUS;
        this.stepper['operationType'] = this.itemSelected.OPERATIONTYPE;
        this.stepper['creationDate'] = this.itemSelected.CREATIONDATE;
        this.stepper['authDate'] = this.itemSelected.AUTHDATE;
        this.beneficiary = this.beneficiaryService.mapGetBeneficiary(this.itemSelected.OPERATIONDATA, true);
        if (this.itemSelected.OPERATIONTYPE === 'M' && this.itemSelected.OPERATIONSTATUS === 'PENDING') {
          this.beneficiary.operationType = this.itemSelected.OPERATIONTYPE;
        }
        if (this.beneficiary.internationalBeneficiary) {
          this.beneficiaryService.getBeneficiaryDetail(this.beneficiary.clientNumber).subscribe(response => {
            let ordenantResponse = JSON.parse(response.data);
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

            this.stepper['beneficiary'] = this.beneficiary;
            this.stepper['beneficiaryRaw'] = this.itemSelected.OPERATIONDATA;
            if (this.beneficiary.benefStatus !== undefined && this.beneficiary.benefStatus == 'ACTIVE') {
              this.stepper['beneficiary']['operationType'] = 'A';
              this.stepper['beneficiaryRaw']['operationType'] = 'A';
            } else if (this.beneficiary.benefStatus !== undefined && this.beneficiary.benefStatus == 'INACTIVE_PLD') {
              this.stepper['beneficiary']['operationType'] = 'I';
              this.stepper['beneficiaryRaw']['operationType'] = 'I';
            } else {
              this.stepper['beneficiary']['operationType'] = 'R';
              this.stepper['beneficiaryRaw']['operationType'] = 'R';
            }
            if (this.stepper['benefOperationStatus'] === 'REJECTED' || this.stepper['benefOperationStatus'] === 'AUTHORIZED') {
              this.showDownload = true;
            } else {
              this.showDownload = false;
            }
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
          // this.beneficiaryService.getBeneficiaryDetail(this.beneficiary.clientNumber).subscribe(response => {
          //   let ordenantResponse = JSON.parse(response.data);
          //   this.beneficiary.ordenantData.address = `${ordenantResponse['CALLE']} ${ordenantResponse['NRO_PUERTA']}`;
          //   if (ordenantResponse.APARTAMENTO !== '') {
          //     this.beneficiary.ordenantData.address += ', ';
          //     this.beneficiary.ordenantData.address += ordenantResponse['APARTAMENTO'];
          //   }
          //   if (ordenantResponse.BARRIO !== '') {
          //     this.beneficiary.ordenantData.address += ', ';
          //     this.beneficiary.ordenantData.address += ordenantResponse['BARRIO'];
          //   }
          //   if (ordenantResponse.CODIGO_POSTAL !== '') {
          //     this.beneficiary.ordenantData.address += ', ';
          //     this.beneficiary.ordenantData.address += `C.P. ${ordenantResponse['CODIGO_POSTAL']}`;
          //   }
          //   this.beneficiary.ordenantData.city = `${ordenantResponse['LOCALIDAD']}, ${ordenantResponse['CIUDAD']}`;
          //   this.beneficiary.ordenantData.country = `${ordenantResponse['PAIS']}`;
          //   this.beneficiary.ordenantData.name = `${ordenantResponse['NOMBRE']}`;
          //
          //
          // }, error => {
          //   this.loading = false;
          //   this.dialog.open(ErrorDialog, {
          //     width: MODAL_SIZE.width,
          //     height: MODAL_SIZE.height,
          //     data: {error: 'errors.genericError'}
          //   });
          // });
          this.stepper['beneficiary'] = this.beneficiary;
          this.stepper['beneficiaryRaw'] = this.itemSelected.OPERATIONDATA;
          if (this.beneficiary.benefStatus !== undefined && this.beneficiary.benefStatus == 'ACTIVE') {
            this.stepper['beneficiary']['operationType'] = 'A';
            this.stepper['beneficiaryRaw']['operationType'] = 'A';
          } else if (this.beneficiary.benefStatus !== undefined && this.beneficiary.benefStatus == 'INACTIVE_PLD') {
            this.stepper['beneficiary']['operationType'] = 'I';
            this.stepper['beneficiaryRaw']['operationType'] = 'I';
          } else {
            this.stepper['beneficiary']['operationType'] = 'R';
            this.stepper['beneficiaryRaw']['operationType'] = 'R';
          }
          if (this.stepper['benefOperationStatus'] === 'REJECTED' || this.stepper['benefOperationStatus'] === 'AUTHORIZED') {
            this.showDownload = true;
          } else {
            this.showDownload = false;
          }
          this.loading = false;
          this.stepper.next();
          scrollToTop();
        }
        break;
      case 'FILEQUERY':
        this.stepper['fileQuery'] = this.itemSelected;
        if (this.stepper['fileQuery']['OPERATIONSTATUS'] === 'AUTHORIZED') {
          this.showDownload = true;
        } else {
          this.showDownload = false;
        }
        this.loading = false;
        this.stepper.next();
        scrollToTop();
        break;

      case 'UNITQUERY':
        this.stepper['unitQuery'] = this.itemSelected;
        this.stepper['statusAuth'] = this.stepper['unitQuery']['OPERATIONSTATUS'];
        if (this.stepper['unitQuery']['OPERATIONSTATUS'] === 'AUTHORIZED') {
          this.showDownload = true;
        } else {
          this.showDownload = false;
        }
        this.loading = false;
        this.stepper.next();
        scrollToTop();
        break;

      case 'BATCH':
        this.stepper['batch'] = this.itemSelected;
        if (this.itemSelected['OPERATIONSTATUS'] === 'AUTHORIZED' || this.itemSelected['OPERATIONSTATUS'] === 'REJECTED') {
          this.showDownload = true;
        } else {
          this.showDownload = false;
        }
        this.loading = false;
        this.stepper.next();
        scrollToTop();
        break;
      case 'REFERENCEDDEPOSIT':
        this.stepper['dataReferencedSelected'] = undefined;
        this.stepper['dataReferencedSelected'] = this.itemSelected;
        if (this.itemSelected['OPERATIONSTATUS'] === 'AUTHORIZED' || this.itemSelected['OPERATIONSTATUS'] === 'REJECTED') {
          this.showDownload = true;
        } else {
          this.showDownload = false;
        }
        this.loading = false;
        this.stepper.next();
        scrollToTop();
        break;
    }
  }

  OnClearClick() {
    this.showClearButton = false;
    this.dataFound = false;
  }

  setItem(item) {
    this.itemSelected = '';
    this.itemSelected = item;
  }
}
