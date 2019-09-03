import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroupDirective, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {BaseComponent} from '../../../../../shared/components/base/base.component';
import {currentDate, minDate} from '../../../../../shared/helpers';

@Component({
  selector: 'two-file-query-operator-filter',
  templateUrl: './fileQuery-operator-filter.component.html',
  styleUrls: ['./fileQuery-operator-filter.component.scss']
})

export class FileQueryOperatorFilterComponent extends BaseComponent implements OnInit {
  @Output()
  formSubmit = new EventEmitter<any>();
  @Input()
  hasRecords: boolean;
  @Output()
  showSearchEmitter = new EventEmitter();
  @Output()
  showNoFoundMessage = new EventEmitter();
  enabledButton = true;
  loading: boolean;
  error;
  filterForm = this.fb.group({
    folio: ['', [Validators.minLength(17)]],
    fileName: ['', [Validators.minLength(22)]],
    accountCharge: ['', [Validators.minLength(11)]],
    dateFrom: [currentDate(), [Validators.required]],
    dateTo: [currentDate(), [Validators.required]],
    status: ['']
  });
  noFoundMessage: string = 'fileQuery.operator.filter.noFoundMessage';
  formToSubmit;
  status = ['VALIDATED', 'VALIDATION_ERROR', 'AUTHORIZE', 'REJECTED', 'ERROR', 'PROCESSED', 'PROCESSED_WITH_ERROR'];
  @ViewChild('form') form: FormGroupDirective;

  constructor(private fb: FormBuilder, public dialog: MatDialog) {
    super();
  }

  get f() {
    return this.filterForm.controls;
  }

  ngOnInit() {
    this.f.folio.disable({onlySelf: true, emitEvent: false});
    this.f.fileName.disable({onlySelf: true, emitEvent: false});
    this.filterForm.valueChanges.subscribe((values) => {
      this.onChangeFormValues(values);
    });
  }

  onSubmit(values: any) {
    if (!this.f.dateFrom.value) {
      let valuesToSubmit = this.filterForm.getRawValue();
      valuesToSubmit.dateFrom = minDate();
      valuesToSubmit.dateTo = currentDate();
      this.formSubmit.emit(valuesToSubmit);
    } else {
      let valuesToSubmit = this.filterForm.getRawValue();
      valuesToSubmit.dateFrom = this.f.dateFrom.value;
      valuesToSubmit.dateTo = this.f.dateTo.value;
      this.formSubmit.emit(valuesToSubmit);
    }
  }

  clean() {
    this.showSearchEmitter.emit(false);
    this.form.resetForm();
  }

  cleanReturn() {
    this.clean();
    this.f.dateFrom.setValue(currentDate(), {emitEvent: false});
    this.f.dateTo.setValue(currentDate(), {emitEvent: false});
  }


  public onChangeFormValues(values) {
    if (!!this.f.dateFrom.value) {
      this.f.fileName.disable({onlySelf: true, emitEvent: false});
      if (!!this.f.folio.value && !this.f.dateTo.value) {
        this.f.dateTo.setValue(this.f.dateFrom.value, {emitEvent: false});
        this.f.dateTo.disable({onlySelf: true, emitEvent: false});
        this.f.fileName.disable({onlySelf: true, emitEvent: false});
        this.f.accountCharge.disable({onlySelf: true, emitEvent: false});
        this.f.status.disable({onlySelf: true, emitEvent: false});
      } else if (!!this.f.folio.value && !!this.f.dateTo.value) {
        this.f.dateTo.setValue(this.f.dateFrom.value, {emitEvent: false});
        this.f.dateTo.disable({onlySelf: true, emitEvent: false});
        this.f.fileName.disable({onlySelf: true, emitEvent: false});
        this.f.accountCharge.disable({onlySelf: true, emitEvent: false});
        this.f.status.disable({onlySelf: true, emitEvent: false});
      } else if (!!this.f.dateTo.value && !this.f.folio.value) {
        if (this.f.dateTo.disabled) {
          this.f.dateTo.setValue(undefined, {emitEvent: false});
          this.f.dateTo.enable({onlySelf: true, emitEvent: false});
        } else {
          this.f.folio.disable({onlySelf: true, emitEvent: false});
          this.f.folio.setValue(undefined, {emitEvent: false});
          this.f.dateTo.enable({onlySelf: true, emitEvent: false});
          this.f.accountCharge.enable({onlySelf: true, emitEvent: false});
          this.f.status.enable({onlySelf: true, emitEvent: false});
        }
      } else if (!this.f.dateTo.value && !this.f.folio.value) {
        this.f.dateFrom.enable({onlySelf: true, emitEvent: false});
        this.f.folio.enable({onlySelf: true, emitEvent: false});
      } else if (!this.f.folio.value) {
        this.f.dateTo.enable({onlySelf: true, emitEvent: false});
      }

      if (!this.f.dateTo.value) {
        this.f.dateTo.markAsTouched({onlySelf: true});
        this.f.dateTo.setErrors({'incorrect': true});
      }
    } else if (!!this.f.dateTo.value) {
      this.f.folio.disable({onlySelf: true, emitEvent: false});
      this.f.folio.setValue(undefined, {emitEvent: false});
      this.f.fileName.disable({onlySelf: true, emitEvent: false});
      this.f.dateFrom.markAsTouched({onlySelf: true});
      this.f.dateFrom.setErrors({'incorrect': true});
    } else if (!!this.f.fileName.value) {
      this.f.dateFrom.disable({onlySelf: true, emitEvent: false});
      this.f.dateTo.disable({onlySelf: true, emitEvent: false});
      this.f.folio.disable({onlySelf: true, emitEvent: false});
      this.f.folio.setValue(undefined, {emitEvent: false});
      this.f.accountCharge.setValue(undefined, {emitEvent: false});
      this.f.accountCharge.disable({onlySelf: true, emitEvent: false});
      this.f.status.setValue('', {emitEvent: false});
      this.f.status.disable({onlySelf: true, emitEvent: false});
    } else if (!!this.f.folio.value) {
      //  this.f.dateFrom.disable({onlySelf: true, emitEvent: false});
      this.f.dateTo.disable({onlySelf: true, emitEvent: false});
      this.f.fileName.disable({onlySelf: true, emitEvent: false});
      this.f.accountCharge.setValue(undefined, {emitEvent: false});
      this.f.accountCharge.disable({onlySelf: true, emitEvent: false});
      this.f.status.setValue('', {emitEvent: false});
      this.f.status.disable({onlySelf: true, emitEvent: false});
    } else if (!!this.f.accountCharge.value || !!this.f.status.value) {
      this.f.folio.disable({onlySelf: true, emitEvent: false});
      this.f.folio.setValue(undefined, {emitEvent: false});
      this.f.fileName.disable({onlySelf: true, emitEvent: false});
    } else {
      this.f.dateFrom.enable({onlySelf: true, emitEvent: false});
      this.f.dateTo.enable({onlySelf: true, emitEvent: false});
      this.f.fileName.enable({onlySelf: true, emitEvent: false});
      this.f.accountCharge.enable({onlySelf: true, emitEvent: false});
      this.f.status.enable({onlySelf: true, emitEvent: false});
      this.f.folio.enable({onlySelf: true, emitEvent: false});
    }
  }

  search() {
    this.showNoFoundMessage.emit(true);
    this.onSubmit(this.filterForm.value);
  }

  get isValidForm() {
    return this.filterForm.valid && (!this.f.dateFrom.value && !this.f.dateTo.value || this.f.dateFrom.value <= this.f.dateTo.value);
  }
}
