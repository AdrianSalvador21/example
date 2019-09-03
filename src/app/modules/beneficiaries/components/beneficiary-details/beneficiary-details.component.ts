import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Beneficiary, NewOperation, Profile} from '../../../../shared/models';
import {currentDateWithTime, fadeInOut, MODAL_SIZE, scrollToTop} from '../../../../shared/helpers';
import {AppConfig} from '../../../../configs/app.config';
import {BeneficiaryService} from '../../../../core/services';
import {MatDialog, MatStepper} from '@angular/material';
import {Router} from '@angular/router';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {AlterDialog} from '../../../../shared/components/alter-dialog/alter-dialog.component';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';

@Component({
  selector: 'two-beneficiary-details',
  templateUrl: './beneficiary-details.component.html',
  styleUrls: ['./beneficiary-details.component.scss'],
  animations: [fadeInOut]
})

export class BeneficiaryDetailsComponent extends BaseComponent implements OnInit {

  @Input()
  set blockEdition(value) {
    if (value) {
      this.editableFields = [];
      this.localBeneficiaryForm.controls.legalReference.disable({onlySelf: true, emitEvent: false});
      this.internationalBeneficiaryForm.controls.beneficiaryName.disable({onlySelf: true, emitEvent: false});
      this.blockButtons = true;
    } else {
      this.editableFields = ['alias', 'email', 'justification', 'phone', 'maximumAmount', 'intermediaryBank', 'legalReference', 'relationType'];
      this.blockButtons = false;
    }
  }

  @Input() spidComboValues: MatStepper;

  @Output()
  destroy: EventEmitter<boolean> = new EventEmitter();
  @Input()
  stepper: MatStepper;
  @Input() showButtons: boolean;

  blockButtons = false;

  showConfirmationButtons: boolean;
  operType: string;
  loading: boolean;
  flag: boolean = true;
  onlyConsult = true;

  valuesBeforeModify = {
    alias: '',
    email: '',
    justification: '',
    maximumAmount: '',
    rfc: '',
    curp: '',
    legalReference: ''
  };

  statusBeforeModify = '';

  /**
   * Beneficiary form object
   */
  localBeneficiaryForm = this.fb.group({
    personType: ['', Validators.required],
    beneficiaryAccountNumber: ['', Validators.required],
    currency: ['', Validators.required],
    beneficiaryAccountType: ['', Validators.required],
    internationalBeneficiary: [''],
    clientNumber: ['', Validators.required],
    beneficiaryBank: ['', Validators.required],
    alias: ['', Validators.required],
    legalReference: [''],
    firstLastName: [''],
    secondLastName: [''],
    rfc: [''],
    curp: ['', Validators.minLength(18)],
    userIB: [''],
    email: [''],
    phone: ['', Validators.minLength(10)],
    justification: [''],
    maximumAmount: ['', Validators.required],
    relationType: ['', Validators.required]
  });

  ordenantForm = this.fb.group({
    name: [''],
    country: [''],
    address: [''],
    city: ['']
  });

  beneficiaryBankForm = this.fb.group({
    bic: [''],
    country: [''],
    beneficiaryBank: [''],
    city: [''],
    address: ['']
  });

  internationalBeneficiaryForm = this.fb.group({
    personType: ['', Validators.required],
    beneficiaryAccountNumber: ['', Validators.required],
    currency: ['', Validators.required],
    beneficiaryAccountType: ['', Validators.required],
    internationalBeneficiary: [''],
    clientNumber: ['', Validators.required],
    beneficiaryBank: ['', Validators.required],
    accountType: [''],
    email: [''],
    beneficiaryAccount: [''],
    justification: [''],
    beneficiaryName: [''],
    beneficiaryCountry: [''],
    maximumAmount: ['', Validators.required],
    beneficiaryCity: [''],
    userIB: [''],
    userPhone: [''],
    loadDate: [''],
    beneficiaryAddress: [''],
    loadTime: [''],
    charges: [''],
    modificationDate: [''],
    alias: ['', Validators.required],
    modificationTime: [''],
    intermediaryBank: [''],
    intermediaryBankNo: [''],
    intermediaryBankYes: ['']
  });

  intermediaryBankForm = this.fb.group({
    showIntermediaryBank: [''],
    intermediaryBank: [''],
    intermediaryBankBic: [''],
    beneficiaryCountry: [''],
    beneficiaryCity: [''],
    beneficiaryAddress: ['']
  });

  statusForm = this.fb.group({
    benefStatus: ['']
  });

  editableFields = ['alias', 'email', 'justification', 'phone', 'maximumAmount', 'intermediaryBank', 'legalReference', 'relationType'];

  error;
  disabledPhoneByAccount = ['01', '40', '03'];
  internationalBeneficiaryTypes = [
    {
      id: true,
      description: 'international-person'
    },
    {
      id: false,
      description: 'local-person'
    }
  ];

  personTypes = [
    {
      id: '00',
      desc: 'physical-person'
    },
    {
      id: '01',
      desc: 'moral-person'
    }
  ];

  localAccountTypes = [
    {
      id: '01',
      desc: 'thirdparty-sabadell'
    },
    {
      id: '40',
      desc: 'spei'
    },
    {
      id: '41',
      desc: 'spid'
    },
    {
      id: '03',
      desc: 'tdd/tdc'
    },
    {
      id: '10',
      desc: 'ltm'
    },
    {
      id: '##',
      desc: 'internacional'
    }
    ,
    {
      id: '0',
      desc: 'internacional'
    }
  ];

  @Input() role: Profile;
  @Input() beneficiary: Beneficiary;

  protected initialBeneficiaryRaw: any;
  protected _beneficiaryRaw: any;
  @Input()
  set beneficiaryRaw(value: any) {
    this._beneficiaryRaw = value;
    this.initialBeneficiaryRaw = Object.assign({}, value);
    if (this._beneficiaryRaw.benefAccountCurrency !== 'USD' || this._beneficiaryRaw.benefAccountType !== '40') {
      const index = this.editableFields.indexOf('relationType');
      this.editableFields.splice(index, 1);
      this.localBeneficiaryForm.controls.relationType.disable();
    } else {
      this.localBeneficiaryForm.controls.relationType.setValue(this._beneficiaryRaw.tipoRelacion);
    }
  }

  get beneficiaryRaw(): any {
    return this._beneficiaryRaw;
  }

  @Input() operationData: any;
  @Input() operationType: string;

  constructor(private fb: FormBuilder, private beneficiaryService: BeneficiaryService, public dialog: MatDialog, public router: Router) {
    super();
  }

  get localControls() {
    return this.localBeneficiaryForm.controls;
  }

  get internationalControls() {
    return this.internationalBeneficiaryForm.controls;
  }

  onModify() {
    const dialogRef = this.dialog.open(AlterDialog, {
      width: MODAL_SIZE.width,
      height: MODAL_SIZE.height,
      disableClose: true,
      data: {message: 'beneficiary.detail.edition-disclaimer', date: undefined}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Y') {
        this.operType = 'M';
        this.initOperation();
      } else {
        return;
      }
    });
  }

  onDelete() {
    this.stepper['deleteMessage'] = 'true';
    const dialogRef = this.dialog.open(AlterDialog, {
      width: MODAL_SIZE.width,
      height: MODAL_SIZE.height,
      disableClose: true,
      data: {message: 'beneficiary.detail.remove-disclaimer', date: undefined}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Y') {
        this.operType = 'B';
        this._beneficiaryRaw = this.initialBeneficiaryRaw;
        this.loadBeneficiaryDefaultData();
        this.initOperation();
      } else {
        return;
      }
    });
  }

  initOperation() {
    this.loading = true;
    let sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));

    if (this._beneficiaryRaw.benefAccountType === '41') {
      this._beneficiaryRaw.benefAccountType = '40';
    }
    let operObj = <NewOperation> {
      operationGroup: 'BENEFICIARY',
      operationType: this.operType,
      operationData: this._beneficiaryRaw,
      additionals: {
        TipoRelacion: this.localBeneficiaryForm.controls.relationType.value
      },
      creatorUser: sessionData.username,
      creatorRol: sessionData.role,
      clientID: this.beneficiary.clientNumber,
      benefAccount: this.beneficiary.beneficiaryAccountNumber,
      operationAmount: -1,
      operationCurrency: ''
    };
    operObj.operationData.benefMaxAmount = operObj.operationData.benefMaxAmount.toString();

    this.beneficiaryService.initOperation(operObj).subscribe((response) => {
      if (response.errorCode === '0') {
        this.stepper['folio'] = response.data.folio;
      }
      this.loading = false;
      if (!response || response.errorCode !== '0') {
        if (response.errorCode === '-49018') {
          this.dialog.open(ErrorDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {error: 'errors.pendingOperation'}
          });
        } else {
          this.dialog.open(ErrorDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {error: 'errors.genericError'}
          });
        }
        return;
      }
      if (this.beneficiary.internationalBeneficiary) {
        this.beneficiary.internationalBeneficiaryData.modificationDate = currentDateWithTime().format(AppConfig.dateFormat);
        this._beneficiaryRaw.modificationDate = currentDateWithTime().format(AppConfig.dateFormat);
        this.beneficiary.internationalBeneficiaryData.modificationTime = currentDateWithTime().format(AppConfig.longTimeFormat);
        this._beneficiaryRaw.modificationTime = currentDateWithTime().format(AppConfig.longTimeFormat);
      } else {
        this.beneficiary.localBeneficiaryData.modificationDate = currentDateWithTime().format(AppConfig.dateFormat);
        this._beneficiaryRaw.modificationDate = currentDateWithTime().format(AppConfig.dateFormat);
        this.beneficiary.localBeneficiaryData.modificationTime = currentDateWithTime().format(AppConfig.longTimeFormat);
        this._beneficiaryRaw.modificationTime = currentDateWithTime().format(AppConfig.longTimeFormat);
      }

      this.stepper['data'] = this.beneficiary;
      this.stepper['data']['showInternationalForm'] = this.internationalControls.intermediaryBank.value;
      this.stepper['data']['operationType'] = this.operType;
      this.stepper['showInternationalForm'] = this.internationalControls.intermediaryBank.value;
      this.stepper.next();
      scrollToTop();
      this.destroy.emit();
    }, (err) => {
      this.loading = false;
      this.dialog.open(ErrorDialog, {
        width: MODAL_SIZE.width,
        height: MODAL_SIZE.height,
        disableClose: true,
        data: {error: 'errors.genericError'}
      });
    });
  }

  onCancelClick() {
    if (this.operType === 'M') {
      if (this.beneficiary.internationalBeneficiary) {
        Object.keys(this.internationalControls).forEach((key) => {
          this.internationalControls[key].disable({onlySelf: true, emitEvent: false});
        });
        Object.keys(this.valuesBeforeModify).forEach((key) => {
          if (key === 'rfc' || key === 'curp') {
            return;
          }
          this.internationalControls[key].setValue(this.valuesBeforeModify[key]);
        });
      } else {
        Object.keys(this.localControls).forEach((key) => {
          this.localControls[key].disable({onlySelf: true, emitEvent: false});
        });
        Object.keys(this.valuesBeforeModify).forEach((key) => {
          this.localControls[key].setValue(this.valuesBeforeModify[key]);
        });
      }
    }
    this.showConfirmationButtons = false;
  }

  ngOnInit() {

    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    let roles = (<string>sessionData.role).split(',');
    roles.forEach((rol) => {
      if (rol !== 'CONSULTIVE') {
        this.onlyConsult = false;
      }
    });

    if (this.onlyConsult) {
      this.editableFields = [];
      this.localBeneficiaryForm.controls.legalReference.disable({onlySelf: true, emitEvent: false});
      this.internationalBeneficiaryForm.controls.beneficiaryName.disable({onlySelf: true, emitEvent: false});
    }


    if (this.beneficiary.personType === '01') {
      this.localControls.rfc.setValidators([Validators.pattern(this.regexRFC), Validators.minLength(12)]);
    } else if (this.beneficiary.personType === '00') {
      this.localControls.rfc.setValidators([Validators.pattern(this.regexRFC), Validators.minLength(13)]);
    }

    if (!!this.beneficiary) {
      if (this.beneficiary.benefStatus === 'ACTIVE') {
        this.statusForm.controls['benefStatus'].setValue('A');
      } else if (this.beneficiary.benefStatus === 'INACTIVE_PLD') {
        this.statusForm.controls['benefStatus'].setValue('I');
      }
      if (!this.flag) {
        this.statusForm.controls['benefStatus'].disable({onlySelf: true, emitEvent: false});
      }
      if (!this.beneficiary.internationalBeneficiary) {
        Object.keys(this.localControls).forEach((key) => {
          if (this.beneficiary.hasOwnProperty(key)) {
            this.localControls[key].setValue(this.beneficiary[key]);
          } else {
            this.localControls[key].setValue(this.beneficiary.localBeneficiaryData[key]);
          }
          this.localControls[key].disable({onlySelf: true, emitEvent: false});
        });
      } else {
        Object.keys(this.internationalControls).forEach((key) => {
          if (this.beneficiary.hasOwnProperty(key)) {
            this.internationalControls[key].setValue(this.beneficiary[key]);
          } else {
            this.internationalControls[key].setValue(this.beneficiary.internationalBeneficiaryData[key]);
          }
          this.internationalControls[key].disable({onlySelf: true, emitEvent: false});
        });
        if (this.beneficiary.intermediaryBankData !== undefined) {
          Object.keys(this.intermediaryBankForm.controls).forEach((key) => {
            this.intermediaryBankForm.controls[key].setValue(this.beneficiary.intermediaryBankData[key]);
            if (key !== 'showIntermediaryBank') {
              this.intermediaryBankForm.controls[key].disable({onlySelf: true, emitEvent: false});
            }
          });
        }
        if (this.beneficiary.beneficiaryBankData !== undefined) {
          Object.keys(this.beneficiaryBankForm.controls).forEach((key) => {
            this.beneficiaryBankForm.controls[key].setValue(this.beneficiary.beneficiaryBankData[key]);
            this.beneficiaryBankForm.controls[key].disable({onlySelf: true, emitEvent: false});
          });
        }
        if (this.beneficiary.ordenantData !== undefined) {
          Object.keys(this.ordenantForm.controls).forEach((key) => {
            this.ordenantForm.controls[key].setValue(this.beneficiary.ordenantData[key]);
            this.ordenantForm.controls[key].disable({onlySelf: true, emitEvent: false});
          });
        }
      }
      if (this.beneficiary.internationalBeneficiary) {
        Object.keys(this.internationalControls).forEach((key) => {
          if (true) {
            if (this.editableFields.indexOf(key) > -1) {
              this.valuesBeforeModify[key] = this.beneficiary.internationalBeneficiaryData[key];
              this.internationalControls[key].enable({onlySelf: true, emitEvent: false});
              return;
            }
            if (key === 'beneficiaryName') {
              this.valuesBeforeModify[key] = this.beneficiary.internationalBeneficiaryData[key];
              if (!this.blockButtons && !this.onlyConsult) {
                this.internationalControls[key].enable({onlySelf: true, emitEvent: false});
              }
              return;
            }
          }
          this.internationalControls[key].disable({onlySelf: true, emitEvent: false});
        });
      }
      // Si local
      else {
        Object.keys(this.localControls).forEach((key) => {
          if (true) {
            if (((key === 'curp' && this.beneficiary.localBeneficiaryData[key] === '' && this.beneficiary.personType === '00') ||
              (key === 'rfc' && this.beneficiary.localBeneficiaryData[key] === '') ||
              (this.editableFields.indexOf(key) > -1)) && !this.blockButtons && !this.onlyConsult) {
              this.valuesBeforeModify[key] = this.beneficiary.localBeneficiaryData[key];
              this.localControls[key].enable({onlySelf: true, emitEvent: false});
              return;
            }
            if (key === 'legalReference' && this.beneficiary.personType === '01' && !this.blockButtons && !this.onlyConsult) {
              this.valuesBeforeModify[key] = this.beneficiary.localBeneficiaryData[key];
              this.localControls[key].enable({onlySelf: true, emitEvent: false});
              return;
            }
          }
          this.localControls[key].disable({onlySelf: true, emitEvent: false});
        });
      }
    }
    if (this.disabledPhoneByAccount.includes(this.beneficiary.beneficiaryAccountType)) {
      this.localBeneficiaryForm.controls.phone.disable({onlySelf: true, emitEvent: false});
      this.internationalBeneficiaryForm.controls.userPhone.disable({onlySelf: true, emitEvent: false});
    }
    this.localBeneficiaryForm.valueChanges.subscribe(() => this.modifyBeneficiary());
    this.internationalBeneficiaryForm.valueChanges.subscribe(() => this.modifyBeneficiary());
  }

  get modified(): boolean {
    if (this.beneficiary.internationalBeneficiary) {
      if (this._beneficiaryRaw.benefAlias !== this.initialBeneficiaryRaw.benefAlias) {
        return true;
      }
      if (this._beneficiaryRaw.benefEmail !== this.initialBeneficiaryRaw.benefEmail) {
        return true;
      }
      if (this._beneficiaryRaw.benefJustification !== this.initialBeneficiaryRaw.benefJustification) {
        return true;
      }
      if (this._beneficiaryRaw.benefMaxAmount != this.initialBeneficiaryRaw.benefMaxAmount) {
        return true;
      }
      if (this._beneficiaryRaw.benefName !== this.initialBeneficiaryRaw.benefName) {
        return true;
      }
    } else {
      if (this._beneficiaryRaw.benefAlias !== this.initialBeneficiaryRaw.benefAlias) {
        return true;
      }
      if (this._beneficiaryRaw.benefPhone !== this.initialBeneficiaryRaw.benefPhone) {
        return true;
      }
      if (this._beneficiaryRaw.benefEmail !== this.initialBeneficiaryRaw.benefEmail) {
        return true;
      }
      if (this._beneficiaryRaw.benefCURP !== this.initialBeneficiaryRaw.benefCURP) {
        return true;
      }
      if (this._beneficiaryRaw.benefDocNumber !== this.initialBeneficiaryRaw.benefDocNumber) {
        return true;
      }
      if (this._beneficiaryRaw.benefJustification !== this.initialBeneficiaryRaw.benefJustification) {
        return true;
      }
      if (this._beneficiaryRaw.benefMaxAmount != this.initialBeneficiaryRaw.benefMaxAmount) {
        return true;
      }
      if (this._beneficiaryRaw.benefName !== this.initialBeneficiaryRaw.benefName) {
        return true;
      }
    }
    return false;
  }

  loadBeneficiaryDefaultData() {
    if (this.beneficiary.internationalBeneficiary) {
      this.beneficiary.internationalBeneficiaryData.alias = this._beneficiaryRaw.benefAlias;
      this.beneficiary.internationalBeneficiaryData.email = this._beneficiaryRaw.benefEmail;
      this.beneficiary.internationalBeneficiaryData.justification = this._beneficiaryRaw.benefJustification;
      this.beneficiary.internationalBeneficiaryData.maximumAmount = this._beneficiaryRaw.benefMaxAmount;
      this.beneficiary.internationalBeneficiaryData.beneficiaryName = this._beneficiaryRaw.benefName;
    } else {
      this.beneficiary.localBeneficiaryData.alias = this._beneficiaryRaw.benefAlias;
      this.beneficiary.localBeneficiaryData.phone = this._beneficiaryRaw.benefPhone;
      this.beneficiary.localBeneficiaryData.email = this._beneficiaryRaw.benefEmail;
      this.beneficiary.localBeneficiaryData.curp = this._beneficiaryRaw.benefCURP;
      if (this.beneficiary.benefDocType === 'RFC') {
        this.beneficiary.localBeneficiaryData.rfc = this._beneficiaryRaw.benefDocNumber;
      }
      if (this.beneficiary.benefDocType !== 'RFC' && this.localControls['rfc'].value !== '') {
        this._beneficiaryRaw.benefDocType = 'RFC';
        this._beneficiaryRaw.benefDocCountry = 'MX';
        this._beneficiaryRaw.benefDocNumber = this.beneficiary.localBeneficiaryData.rfc;
      }
      this.beneficiary.localBeneficiaryData.justification = this._beneficiaryRaw.benefJustification;
      this.beneficiary.localBeneficiaryData.maximumAmount = this._beneficiaryRaw.benefMaxAmount;
      this.beneficiary.localBeneficiaryData.legalReference = this._beneficiaryRaw.benefName;
    }
  }

  modifyBeneficiary() {
    if (this.beneficiary.internationalBeneficiary) {

      this.beneficiary.internationalBeneficiaryData.alias = this.internationalControls['alias'].value;
      this._beneficiaryRaw.benefAlias = this.internationalControls['alias'].value;

      this.beneficiary.internationalBeneficiaryData.email = this.internationalControls['email'].value;
      this._beneficiaryRaw.benefEmail = this.internationalControls['email'].value;

      this.beneficiary.internationalBeneficiaryData.justification = this.internationalControls['justification'].value;
      this._beneficiaryRaw.benefJustification = this.internationalControls['justification'].value;

      this.beneficiary.internationalBeneficiaryData.maximumAmount = this.internationalControls['maximumAmount'].value;
      this._beneficiaryRaw.benefMaxAmount = this.internationalControls['maximumAmount'].value;

      this.beneficiary.internationalBeneficiaryData.beneficiaryName = this.internationalControls['beneficiaryName'].value;
      this._beneficiaryRaw.benefName = this.internationalControls['beneficiaryName'].value;

    } else {

      this.beneficiary.localBeneficiaryData.alias = this.localControls['alias'].value;
      this._beneficiaryRaw.benefAlias = this.localControls['alias'].value;

      this.beneficiary.localBeneficiaryData.phone = this.localControls['phone'].value;
      this._beneficiaryRaw.benefPhone = this.localControls['phone'].value;

      this.beneficiary.localBeneficiaryData.email = this.localControls['email'].value;
      this._beneficiaryRaw.benefEmail = this.localControls['email'].value;

      this.beneficiary.localBeneficiaryData.curp = this.localControls['curp'].value;
      this._beneficiaryRaw.benefCURP = this.localControls['curp'].value;

      if (this.beneficiary.benefDocType === 'RFC') {
        this.beneficiary.localBeneficiaryData.rfc = this.localControls['rfc'].value;
        this._beneficiaryRaw.benefDocNumber = this.localControls['rfc'].value;
      }

      if (this.beneficiary.benefDocType !== 'RFC' && this.localControls['rfc'].value !== '') {
        this._beneficiaryRaw.benefDocType = 'RFC';
        this._beneficiaryRaw.benefDocCountry = 'MX';
        this._beneficiaryRaw.benefDocNumber = this.localControls['rfc'].value;
        this.beneficiary.localBeneficiaryData.rfc = this.localControls['rfc'].value;
      }

      this.beneficiary.localBeneficiaryData.justification = this.localControls['justification'].value;
      this._beneficiaryRaw.benefJustification = this.localControls['justification'].value;

      this.beneficiary.localBeneficiaryData.maximumAmount = this.localControls['maximumAmount'].value;
      this._beneficiaryRaw.benefMaxAmount = this.localControls['maximumAmount'].value;

      this.beneficiary.localBeneficiaryData.legalReference = this.localControls['legalReference'].value;
      this._beneficiaryRaw.benefName = this.localControls['legalReference'].value;
    }
  }
}
