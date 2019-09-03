import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroupDirective, Validators} from '@angular/forms';
import {Beneficiary} from '../../../../shared/models';
import {BeneficiaryService} from '../../../../core/services';
import {fadeInOut, MODAL_SIZE} from '../../../../shared/helpers';
import {MatDialog, MatStepper} from '@angular/material';
import {ErrorDialog} from 'src/app/shared/components/error-modal/error-dialog-component';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';

@Component({
  selector: 'two-beneficiary-filter',
  templateUrl: './beneficiary-operator-filter.component.html',
  styleUrls: ['./beneficiary-operator-filter.component.scss'],
  animations: [fadeInOut]
})

export class BeneficiaryOperatorFilterComponent extends BaseComponent implements OnInit {
  error;
  loading;
  showDetail: boolean = false;
  @Input() stepper: MatStepper;
  @Output() beneficiaryFounded = new EventEmitter<Beneficiary>();
  filterForm = this.fb.group({
    clientNumber: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(this.regexNumber)]],
    alias: ['', [Validators.maxLength(30), Validators.pattern(this.regexAlias)]],
    accountNumber: ['', [Validators.minLength(10), Validators.maxLength(18), Validators.pattern(this.regexNumber)]],
    benefType: ['']
  });

  benefTypes = ['I', 'N'];
  @Output() cleanData = new EventEmitter<any>();
  @ViewChild('form') form: FormGroupDirective;

  constructor(private fb: FormBuilder, private beneficiaryService: BeneficiaryService, public dialog: MatDialog) {
    super();
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.filterForm.controls;
  }

  get isValidForm() {
    return this.filterForm.valid && ((!!this.f.alias.value && !!this.f.clientNumber.value) || (!!this.f.accountNumber.value && !!this.f.clientNumber.value && !!this.f.benefType.value));
  }

  ngOnInit() {
    this.filterForm.valueChanges.subscribe((values) => {
      this.onChangeFormValues(values);
    });
  }

  onSubmit(formData: any) {
    this.beneficiaryFounded.emit(undefined);
    this.loading = true;
    this.beneficiaryService.getBeneficiary(
      formData.clientNumber,
      formData.alias,
      formData.accountNumber,
      'ACTIVE', formData.benefType, true).subscribe((response) => {
        if (response !== undefined && !!response['data']) {
          if (response['data'][0].length == 0) {
            this.dialog.open(MessageDialog, {
              width: MODAL_SIZE.width,
              height: MODAL_SIZE.height,
              disableClose: true,
              data: {message: 'beneficiary.operator.filter.error.noRecords'}
            });
          } else if (response['data'][0].length > 1) {
            this.dialog.open(MessageDialog, {
              width: MODAL_SIZE.width,
              height: MODAL_SIZE.height,
              disableClose: true,
              data: {message: 'errors.genericError'}
            });
          } else {
            this.showDetail = true;
            this.beneficiaryService.getSPIDBeneficiary().subscribe(spidResponse => {
              const spidValues = [];
              spidResponse.forEach(value => {
                spidValues.push(value.VALOR10110);
              });

              this.stepper['spidComboValues'] = spidValues;
            });
            this.beneficiaryFounded.emit(response);
          }
        } else if (!!response && !!response['errorCode']) {
          this.dialog.open(ErrorDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {error: !!response && !!response['msg'] ? response['msg'] : 'errors.genericError'}
          });
          this.loading = false;
          return;
        }
        this.loading = false;
      }, err => {
        this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: 'errors.unexpected'}
        });
        this.loading = false;
      }
    );

  }

  onChangeFormValues(values: any) {
    if (!!values.alias) {
      this.f.accountNumber.disable({onlySelf: true, emitEvent: false});
      this.f.benefType.disable({onlySelf: true, emitEvent: false});
      this.f.benefType.setValue('', {emitEvent: false});
    } else if (!!values.accountNumber) {
      this.f.alias.disable({onlySelf: true, emitEvent: false});
    } else {
      this.f.accountNumber.enable({onlySelf: true, emitEvent: false});
      this.f.alias.enable({onlySelf: true, emitEvent: false});
      this.f.benefType.enable({onlySelf: true, emitEvent: false});
    }
  }

  clean() {
    this.cleanData.emit();
    this.resetForm();
  }

  resetForm() {
    this.showDetail = false;
    this.form.resetForm();
  }
}
