import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroupDirective, Validators} from '@angular/forms';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {currentDate} from '../../../../shared/helpers';

@Component({
  selector: 'two-operation-status-full-filter',
  templateUrl: './operation-status-full-filter.component.html',
  styleUrls: ['./operation-status-full-filter.component.scss']
})
export class OperationStatusFullFilterComponent extends BaseComponent implements OnInit {
  @ViewChild('form') form: FormGroupDirective;
  @Output() formSubmit = new EventEmitter();
  @Output() clearClick = new EventEmitter();
  @Input() showClearButton: boolean;
  loading: boolean;
  filterForm = this.fb.group({
    clientID: ['', [Validators.minLength(9)]],
    folio: ['', [Validators.minLength(17)]],
    dateFrom: [currentDate(), [Validators.required]],
    dateTo: [currentDate(), [Validators.required]],
    creatorUser: [''],
    authUser: ['']
  });

  get f() {
    return this.filterForm.controls;
  }

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.f.folio.disable({onlySelf: true, emitEvent: false});
    this.filterForm.valueChanges.subscribe(() => {
      this.onChangeFormValues();
    });
  }

  onSubmit(value: any) {
    this.formSubmit.emit(this.filterForm.getRawValue());
  }

  onChangeFormValues() {
    if (!!this.f.dateFrom.value) {
      if (!!this.f.clientID.value || !!this.f.creatorUser.value || !!this.f.authUser.value) {
        this.f.folio.disable({onlySelf: true, emitEvent: false});
      } else if (!!this.f.folio.value && (!this.f.dateTo.value)) {
        this.f.dateTo.setValue(this.f.dateFrom.value, {emitEvent: false});
        this.f.dateTo.disable({onlySelf: true, emitEvent: false});
        this.f.clientID.disable({onlySelf: true, emitEvent: false});
        this.f.creatorUser.disable({onlySelf: true, emitEvent: false});
        this.f.authUser.disable({onlySelf: true, emitEvent: false});
      } else if (!!this.f.folio.value && !!this.f.dateTo.value) {
        this.f.dateTo.setValue(this.f.dateFrom.value, {emitEvent: false});
        this.f.dateTo.disable({onlySelf: true, emitEvent: false});
        this.f.clientID.disable({onlySelf: true, emitEvent: false});
        this.f.creatorUser.disable({onlySelf: true, emitEvent: false});
        this.f.authUser.disable({onlySelf: true, emitEvent: false});
      } else if (!!this.f.dateTo.value && !this.f.folio.value) {
        if (this.f.dateTo.disabled) {
          this.f.dateTo.setValue(undefined, {emitEvent: false});
          this.f.dateTo.enable({onlySelf: true, emitEvent: false});
        } else {
          this.f.folio.disable({onlySelf: true, emitEvent: false});
          this.f.dateTo.enable({onlySelf: true, emitEvent: false});
          this.f.clientID.enable({onlySelf: true, emitEvent: false});
          this.f.creatorUser.enable({onlySelf: true, emitEvent: false});
          this.f.authUser.enable({onlySelf: true, emitEvent: false});
        }
      } else if ((!this.f.dateTo.value) && (!this.f.folio.value)) {
        this.f.dateFrom.enable({onlySelf: true, emitEvent: false});
        this.f.folio.enable({onlySelf: true, emitEvent: false});
      } else if (!this.f.folio.value) {
        this.f.dateTo.enable({onlySelf: true, emitEvent: false});
        this.f.clientID.enable({onlySelf: true, emitEvent: false});
        this.f.creatorUser.enable({onlySelf: true, emitEvent: false});
        this.f.authUser.enable({onlySelf: true, emitEvent: false});
      }
      if (!this.f.dateTo.value) {
        this.f.dateTo.markAsTouched({onlySelf: true});
        this.f.dateTo.setErrors({'incorrect': true, emitEvent: false});
      }
    } else if (!!this.f.dateTo.value) {
      this.f.folio.disable({onlySelf: true, emitEvent: false});
      this.f.dateFrom.markAsTouched({onlySelf: true});
      this.f.dateFrom.setErrors({'incorrect': true, emitEvent: false});
    } else if (!!this.f.folio.value) {
      this.f.dateTo.disable({onlySelf: true, emitEvent: false});
      this.f.clientID.setValue('', {emitEvent: false});
      this.f.clientID.disable({onlySelf: true, emitEvent: false});
      this.f.creatorUser.setValue('', {emitEvent: false});
      this.f.creatorUser.disable({onlySelf: true, emitEvent: false});
      this.f.authUser.setValue('', {emitEvent: false});
      this.f.authUser.disable({onlySelf: true, emitEvent: false});
    } else if (!!this.f.clientID.value || !!this.f.creatorUser.value || !!this.f.authUser.value) {
      this.f.folio.setValue('', {emitEvent: false});
      this.f.folio.disable({onlySelf: true, emitEvent: false});
    } else {
      this.f.dateFrom.enable({onlySelf: true, emitEvent: false});
      this.f.dateTo.enable({onlySelf: true, emitEvent: false});
      this.f.folio.enable({onlySelf: true, emitEvent: false});
      this.f.clientID.enable({onlySelf: true, emitEvent: false});
      this.f.creatorUser.enable({onlySelf: true, emitEvent: false});
      this.f.authUser.enable({onlySelf: true, emitEvent: false});
    }
  }

  cleanForm() {
    this.filterForm.reset();
    this.filterForm.clearValidators();
    this.filterForm.markAsUntouched();
    this.form.resetForm();
    this.clearClick.emit();
  }

  cleanFormInitial() {
    this.cleanForm();
    this.filterForm.controls.dateFrom.setValue(currentDate(), {emitEvent: false});
    this.filterForm.controls.dateTo.setValue(currentDate(), {emitEvent: false});
  }

  get isValidForm() {
    return this.filterForm.valid && !!this.f.dateFrom.value && !!this.f.dateTo.value && this.f.dateFrom.value <= this.f.dateTo.value;
  }

}
