import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroupDirective, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {BaseComponent} from '../../../../shared/components/base/base.component';

@Component({
  selector: 'two-blocked-transactions-filter',
  templateUrl: './blocked-transactions-filter.component.html',
  styleUrls: ['./blocked-transactions-filter.component.scss']
})
export class BlockedTransactionsFilterComponent extends BaseComponent implements OnInit {

  @Output() cleanEmitter = new EventEmitter();
  @Output() formDataEmitter = new EventEmitter();

  filterForm = this.fb.group({
    service: [''],
    documentType: [''],
    documentNumberRFC: ['', [Validators.pattern(this.regexAlphaNumeric), Validators.maxLength(13), Validators.minLength(12)]],
    documentNumberCURP: ['', [Validators.pattern(this.regexAlphaNumeric), Validators.maxLength(18), Validators.minLength(18)]],
    status: ['PENDING'],
    name: ['', [Validators.pattern(this.regexAlphaNumericAndSpaces), Validators.maxLength(40), Validators.minLength(0)]]
  });

  enabledButton = true;
  invalidValue = false;

  invalid = false;
  showClean = true;
  formToSubmit = {
    service: '',
    documentType: '',
    documentNumber: '',
    status: '',
    name: ''
  };
  services = ['spei', 'spid', 'ownAccounts', 'thirdSabadell', 'internationals', 'massivePayment', 'referencedDeposit'];
  documentTypes = ['rfc', 'curp'];
  statusOptions = ['AUTHORIZE', 'REJECTED', 'PENDING'];
  @ViewChild('form') form: FormGroupDirective;

  constructor(private fb: FormBuilder, public dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    this.filterForm.controls.documentNumberRFC.disable({onlySelf: true, emitEvent: false});
    this.filterForm.controls.documentNumberCURP.disable({onlySelf: true, emitEvent: false});
    this.filterForm.valueChanges.subscribe((values) => {
      this.onChangeFormValues();
    });
  }

  onSubmit(value) {
    this.showClean = true;
    this.formToSubmit['service'] = this.filterForm.controls.service.value;
    this.formToSubmit['documentType'] = this.filterForm.controls.documentType.value;
    this.formToSubmit['status'] = this.filterForm.controls.status.value;
    this.formToSubmit['name'] = this.filterForm.controls.name.value;
    if (this.filterForm.controls.documentType.value == 'rfc') {
      this.formToSubmit['documentNumber'] = this.filterForm.controls.documentNumberRFC.value;
    } else {
      this.formToSubmit['documentNumber'] = this.filterForm.controls.documentNumberCURP.value;
    }
    this.formDataEmitter.emit(this.formToSubmit);
  }

  onChangeFormValues() {
    if (!!this.filterForm.controls.documentType.value) {
      this.filterForm.controls.documentNumberRFC.enable({onlySelf: true, emitEvent: false});
      this.filterForm.controls.documentNumberCURP.enable({onlySelf: true, emitEvent: false});
      this.enabledButton = false;
    } else {
      this.filterForm.controls.documentNumberRFC.disable({onlySelf: true, emitEvent: false});
      this.filterForm.controls.documentNumberCURP.disable({onlySelf: true, emitEvent: false});
      this.enabledButton = true;
    }
    this.filterForm.controls.documentNumberRFC.setValue('', {emitEvent: false});
    this.filterForm.controls.documentNumberCURP.setValue('', {emitEvent: false});
  }

  clean() {
    this.form.resetForm();
    this.filterForm.controls.status.setValue('PENDING', {emitEvent: false});
    this.cleanEmitter.emit(false);
    this.showClean = false;
    this.invalidValue = false;
  }

  get validDocumentValue() {
    return this.filterForm.controls.documentNumberRFC.invalid || this.filterForm.controls.documentNumberRFC.invalid;
  }
}
