import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {MatDialog, MatSelect, MatStepper} from '@angular/material';
import {MassivePaymentsService} from '../../../../core/services';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {MODAL_SIZE, scrollToTop} from '../../../../shared/helpers';
import {AppConfig} from '../../../../configs/app.config';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {ReferencedPaymentService} from '../../../../core/services/referencedPayment.service';
import {Router} from '@angular/router';

@Component({
  selector: 'two-upload-file-section',
  templateUrl: './upload-file-section.component.html',
  styleUrls: ['./upload-file-section.component.scss']
})
export class UploadFileSectionComponent extends BaseComponent implements OnInit {
  mimeTypes = ['txt', 'csv'];
  @ViewChild('formDirective') private formDirective: FormGroupDirective;
  @Input() stepper: MatStepper;
  emptyChargeType = false;
  emptyClientID = false;
  emptyIBUser = false;
  emptyFile = false;
  loadingOnUpload = false;
  loading = false;
  formGroup = this.fb.group({
    clientID: ['', [Validators.required, Validators.pattern(this.regexNumber), Validators.maxLength(9), Validators.minLength(9)]],
    file: [null],
    name: [''],
    IBUser: [''],
    accountSelect: ['']
  });
  chargeTypeForm = this.fb.group({
    chargeType: ['2'],
  });
  fileSelected: any = {
    name: '',
    size: '',
    type: ''
  };
  name: string;
  file: any = undefined;
  controlValues: any;
  fileTypeError = false;
  services: ['massivePayment', 'referencedDeposit'];
  passedTime = 0;
  client;
  serviceType;
  accounts = [];
  noAccounts = false;

  constructor(private fb: FormBuilder, private massivePaymentService: MassivePaymentsService,
              private dialog: MatDialog, public router: Router, public referencedPaymentService: ReferencedPaymentService) {
    super();
    this.massivePaymentService.loading.subscribe((value) => {
      this.loadingOnUpload = value;
    });
  }

  ngOnInit() {
    this.formGroup.controls.accountSelect.disable({onlySelf: true, emitEvent: false});
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    const currentUser = sessionData.username;
    this.formGroup.controls.name.disable({onlySelf: true, emitEvent: false});
    this.formGroup.controls.IBUser.setValue(currentUser);
    this.formGroup.controls.IBUser.disable({onlySelf: true, emitEvent: false});
    this.formGroup.controls.clientID.valueChanges.subscribe(() => {
      this.validateNumber();
    });

    this.chargeTypeForm.controls.chargeType.valueChanges.subscribe(() => {
      this.validateService();
    });
  }

  onFileChange(event) {
    this.fileTypeError = false;
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      this.file = event.target.files.item(0);
      this.fileSelected.type = this.file.type;
      this.fileSelected.name = this.file.name;
      this.fileSelected.size = this.file.size;
      const extension = this.file.name.slice(-3);
      if (!this.mimeTypes.includes(extension)) {
        this.fileTypeError = true;
        this.file = undefined;
        this.formGroup.controls.name.setValue('');
        return;
      }
      this.formGroup.controls.name.setValue(this.fileSelected.name);
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.formGroup.patchValue({
          file: reader.result
        });
      };
    }
  }

  showDetail() {
    if (this.chargeTypeForm.value.chargeType === '') {
      this.emptyChargeType = true;
      return;
    }
    this.emptyChargeType = false;
    if (this.formGroup.value.clientID === '') {
      this.emptyClientID = true;
      return;
    }
    this.emptyClientID = false;
    if (this.formGroup.value.IBUser === '') {
      this.emptyIBUser = true;
      return;
    }
    this.emptyIBUser = false;
    if (!this.file) {
      this.emptyFile = true;
      return;
    }
    this.emptyFile = false;
    this.loading = true;
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    this.massivePaymentService.getBatchPath().subscribe((path) => {
      this.massivePaymentService.batchPath = path;
      this.massivePaymentService.uploadBatch(this.file).subscribe(uploadResponse => {
        if (uploadResponse.success) {
          this.massivePaymentService.validateBatch(
            this.formGroup.value.clientID,
            sessionData.username,
            sessionData.sessionID,
            this.file.name).subscribe((validationResponse) => {
            if (validationResponse.errorCode === '0') {
              this.massivePaymentService.initBatch(
                this.formGroup.value.clientID,
                sessionData.username,
                sessionData.sessionID,
                this.file.name,
                this.file.name,
                this.chargeTypeForm.value.chargeType,
                this.formGroup.controls.accountSelect.value
              ).subscribe((initResponse) => {
                if (initResponse.errorCode === '0') {
                  this.verifyUpdatedBatch();
                } else {
                  this.loading = false;
                  this.dialog.open(ErrorDialog, {
                    width: MODAL_SIZE.width,
                    height: MODAL_SIZE.height,
                    disableClose: true,
                    data: {error: 'errors.initError'}
                  });
                }
              });
            } else {
              this.loading = false;
              this.dialog.open(ErrorDialog, {
                width: MODAL_SIZE.width,
                height: MODAL_SIZE.height,
                disableClose: true,
                data: {error: 'errors.batchValidationErrors.' + validationResponse.errorCode}
              });
            }
          });
        } else {
          this.loading = false;
          this.dialog.open(ErrorDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {error: 'errors.uploadError'}
          });
        }
      });
    });
  }

  verifyUpdatedBatch() {
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    this.passedTime += AppConfig.timeBetweenBatchVerification;
    this.massivePaymentService.verifyUploadedFile(this.file.name).subscribe((response) => {
      if (response > 0) {
        this.massivePaymentService.getControlValues(this.file.name).subscribe((responseCtrl) => {
          if (responseCtrl.data[0][0].statusBatch !== 'VALIDATION_ERROR' && responseCtrl.data[0][0].statusBatch !== 'ERROR') {
            this.controlValues = responseCtrl.data[0][0];
            this.controlValues.IBUser = this.formGroup.value.IBUser;
            this.controlValues.userOperator = sessionData.username;
            this.stepper['controlValues'] = this.controlValues;
            this.loading = false;
            this.stepper.next();
            scrollToTop();
          } else {
            this.loading = false;
            this.dialog.open(ErrorDialog, {
              width: MODAL_SIZE.width,
              height: MODAL_SIZE.height,
              disableClose: true,
              data: {error: 'errors.validationErrorAfterInit'}
            });
          }
        });
      } else {
        if (this.passedTime < AppConfig.batchVerificationTimeout) {
          setTimeout(() => this.verifyUpdatedBatch(), AppConfig.timeBetweenBatchVerification);
        } else {
          this.loading = false;
          this.dialog.open(ErrorDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {error: 'errors.timeout'}
          });
        }
      }
    });
  }

  return() {
    this.router.navigate(['/' + AppConfig.routes.operationsModule.root]).then();
  }

  validateNumber() {
    if (this.client === this.formGroup.controls.clientID.value) {
      return;
    }
    this.noAccounts = false;
    this.accounts = [];
    this.formGroup.controls.accountSelect.setValue('', {emitEvent: false});
    if (!this.formGroup.controls.clientID.invalid) {
      this.formGroup.controls.accountSelect.enable({onlySelf: true, emitEvent: false});
    } else {
      this.formGroup.controls.accountSelect.disable({onlySelf: true, emitEvent: false});
    }

    this.client = this.formGroup.controls.clientID.value;
  }

  validateService() {
    if (this.serviceType === this.chargeTypeForm.controls.chargeType.value) {
      return;
    }
    this.accounts = [];
    this.formGroup.controls.accountSelect.setValue('', {emitEvent: false});
    this.serviceType = this.chargeTypeForm.controls.chargeType.value;
  }

  searchAccounts(select: MatSelect) {
    if (this.formGroup.controls.clientID.invalid) {
      return;
    }
    this.noAccounts = false;
    if (this.accounts.length === 0) {
      this.accounts = [];
      select.close();
      this.loading = true;
      this.referencedPaymentService.getContractValidDispersion(this.formGroup.getRawValue(), this.chargeTypeForm.getRawValue().chargeType).subscribe(response => {
      // this.referencedPaymentService.getReferencedPayments(this.formGroup.getRawValue()).subscribe(response => {
        this.loading = false;
        const responseData = JSON.parse(response.data);
        if (Object.keys(responseData.CUENTAS).length === 0) {
          this.noAccounts = true;
          return;
        }
        if (responseData.CUENTAS === {}) {
          this.noAccounts = true;
          return;
        }
        this.noAccounts = false;
        for (let i = 0; i < responseData.CUENTAS.length; i++) {
          let fullAccount = responseData.CUENTAS[i]['Cuenta']['@@TextValue'];
          let account = fullAccount.substring(24, 33) + fullAccount.substring(36, 38);
          this.accounts.push(account);
        }
        this.formGroup.controls.accountSelect.enable({onlySelf: true, emitEvent: false});
        select.open();
      }, error => {
        this.noAccounts = true;
        this.loading = false;
      });
    }
  }

  cleanButton() {
    this.accounts = [];
    this.noAccounts = false;
    this.fileTypeError = false;
    this.file = undefined;
    this.formGroup.markAsTouched();
    this.formDirective.resetForm();
    this.formGroup.controls.accountSelect.disable({onlySelf: true, emitEvent: false});
    this.chargeTypeForm.controls.chargeType.setValue('2', {emitEvent: false});
    this.formGroup.controls.accountSelect.setValue('', {emitEvent: false});
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    const currentUser = sessionData.username;
    this.formGroup.controls.IBUser.setValue(currentUser, {emitEvent: false});
  }
}
