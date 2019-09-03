import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatStepper} from '@angular/material';
import {FormBuilder, Validators} from '@angular/forms';
import {CustomValidateEmail, MODAL_SIZE} from '../../../../shared/helpers';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {BeneficiaryService, OperatorPldService} from '../../../../core/services';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';

@Component({
  selector: 'two-beneficiaries-pld-detail',
  templateUrl: './beneficiaries-pld-detail.component.html',
  styleUrls: ['./beneficiaries-pld-detail.component.scss']
})
export class BeneficiariesPldDetailComponent extends BaseComponent implements OnInit {
  beneficiary;
  @Input() stepper: MatStepper;
  allowBM: boolean;
  allowPLD: boolean;
  showConfirmationButtons: boolean;
  operType: string;
  loading: boolean;
  flag: boolean = true;
  modified: boolean;
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
    alias: ['', [Validators.required, Validators.pattern(this.regexAlias)]],
    legalReference: ['', Validators.pattern(this.regexAlphaNumeric)],
    firstLastName: [''],
    secondLastName: [''],
    rfc: ['', [Validators.pattern(this.regexRFC), Validators.minLength(12)]],
    curp: ['', [Validators.pattern(this.regexCURP), Validators.minLength(18)]],
    userIB: [''],
    email: ['', [CustomValidateEmail]],
    phone: ['', Validators.minLength(10)],
    justification: ['', Validators.pattern(this.regexAlphaNumericAndSpaces)],
    maximumAmount: ['', [Validators.required, Validators.min(0.01), Validators.max(9999999999999999.99)]]
  });
  ordenantForm = this.fb.group({
    name: [''],
    country: [''],
    address: [''],
    city: ['']
  });
  changeStatusForm = this.fb.group({
    status: ['']
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
    email: ['', CustomValidateEmail],
    beneficiaryAccount: [''],
    justification: ['', Validators.pattern(this.regexAlphaNumericAndSpaces)],
    beneficiaryName: [''],
    beneficiaryCountry: [''],
    maximumAmount: ['', [Validators.required, Validators.min(0.01), Validators.max(9999999999999999.99)]],
    beneficiaryCity: [''],
    userIB: [''],
    userPhone: [''],
    loadDate: [''],
    beneficiaryAddress: [''],
    loadTime: [''],
    charges: [''],
    IVA: [''],
    modificationDate: [''],
    alias: ['', [Validators.required, Validators.pattern(this.regexAlias)]],
    modificationTime: [''],
    intermediaryBank: [''],
    intermediaryBankNo: [''],
    intermediaryBankYes: ['']
  });
  intermediaryBankForm = this.fb.group({
    showIntermediaryBank: [false],
    intermediaryBank: [''],
    intermediaryBankBic: [''],
    beneficiaryCountry: [''],
    beneficiaryCity: [''],
    beneficiaryAddress: ['']
  });
  statusForm = this.fb.group({
    benefStatus: ['']
  });
  editableFields = ['alias', 'email', 'justification', 'phone', 'maximumAmount', 'intermediaryBank', 'legalReference'];
  error;
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
      id: '00',
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
  ];
  benefStatusOnPLD = [
    {
      id: 'H',
      desc: 'Habilitado'
    },
    {
      id: 'I',
      desc: 'Inhabilitado'
    },
    {
      id: 'R',
      desc: 'En revisión PLD'
    }
  ];

  constructor(public operatorPldService: OperatorPldService, public dialog: MatDialog, private fb: FormBuilder, private beneficiaryService: BeneficiaryService) {
    super();
  }

  @Input()
  set beneficiaryDataInput(value) {
    // this.changeStatusForm.controls.status.setValue('R');
    this.beneficiary = value;
    if (this.beneficiary.benefStatus == 'ACTIVE') {
      this.changeStatusForm.controls.status.setValue('H');
    } else if (this.beneficiary.benefStatus == 'INACTIVE_PLD') {
      this.changeStatusForm.controls.status.setValue('I');
    } else {
      this.changeStatusForm.controls.status.setValue('R');
    }

  }

  get localControls() {
    return this.localBeneficiaryForm.controls;
  }

  get internationalControls() {
    return this.internationalBeneficiaryForm.controls;
  }

  ngOnInit() {
    // national
    if (!this.beneficiary.internationalBeneficiary) {
      Object.keys(this.localControls).forEach((key) => {
        if (this.beneficiary.hasOwnProperty(key)) {
          this.localControls[key].setValue(this.beneficiary[key]);
        } else {
          this.localControls[key].setValue(this.beneficiary.localBeneficiaryData[key]);
        }
        this.localControls[key].disable({onlySelf: true, emitEvent: false});
      });
      // international
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
  }

  viewDetailSection() {
    this.loading = true;
    this.stepper['data'] = this.beneficiary;
    this.stepper['data']['showIntermediaryBank'] = this.intermediaryBankForm.controls.showIntermediaryBank.value;
    this.stepper['data']['operationType'] = this.changeStatusForm.controls.status.value;
    this.stepper['data']['onPldChangeStatus'] = this.changeStatusForm.controls.status.value;
    let isInter = this.beneficiary.internationalBeneficiary;
    this.operatorPldService.pldBeneficiary({
      clientId: this.beneficiary.clientNumber,
      IBUser: (isInter) ? this.beneficiary.internationalBeneficiaryData.userIB : this.beneficiary.localBeneficiaryData.userIB,
      channelId: 'ADAPTOR',
      benefAlias: (isInter) ? this.beneficiary.internationalBeneficiaryData.alias : this.beneficiary.localBeneficiaryData.alias,
      benefNumber: this.beneficiary.benefNumber,
      benefAccountNumber: this.beneficiary.beneficiaryAccountNumber,
      diaryType: (isInter) ? 'I' : 'N',
      diaryId: this.beneficiary.diaryId,
      benefStatus: this.changeStatusForm.controls.status.value,
      btUpdate: '1'
    }).subscribe(response => {
      this.loading = false;
      let errorCode = (typeof response.errorCode === 'number') ? response.errorCode.toString(): response.errorCode;
      if (errorCode === '0') {
        this.stepper.selectedIndex = 3;
      } else {
        const dialogRef = this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: 'errors.pldError'}
        });
      }
    });
  }

  return() {
    this.stepper.selectedIndex = 0;
  }
}
