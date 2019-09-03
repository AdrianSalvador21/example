import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BeneficiaryService} from '../../../../core/services/index';
import {FormBuilder, NgForm, Validators} from '@angular/forms';
import {currentDate, fadeInOut} from '../../../../shared/helpers/index';
import {BaseComponent} from '../../../../shared/components/base/base.component';

@Component({
  selector: 'two-authorization-filter',
  templateUrl: './authorization-filter.component.html',
  styleUrls: ['./authorization-filter.component.scss'],
  animations: [fadeInOut]
})

export class AuthorizationFilterComponent extends BaseComponent implements OnInit {
  @ViewChild('form') private form: NgForm;

  @Output() formSubmit = new EventEmitter();
  @Output() clearClick = new EventEmitter();
  @Input() showClearButton: boolean;
  loading: boolean;
  errorDateFrom: boolean;
  errorDateTo: boolean;
  errorRange: boolean;
  filterForm = this.fb.group({
    operatorUser: [''],
    clientID: ['', [Validators.minLength(9)]],
    dateFrom: [currentDate(), [Validators.required]],
    dateTo: [currentDate(), [Validators.required]],
    folio: ['', [Validators.minLength(17)]]
  });

  constructor(
    private beneficiaryService: BeneficiaryService,
    private fb: FormBuilder) {
    super();
  }

  get f() {
    return this.filterForm.controls;
  }

  get isValidForm() {
    return this.filterForm.valid && !!this.f.dateFrom.value && !!this.f.dateTo.value && this.f.dateFrom.value <= this.f.dateTo.value;
  }

  ngOnInit() {
    this.f.folio.disable({onlySelf: true, emitEvent: false});
    this.filterForm.valueChanges.subscribe((values) => {
      this.onChangeFormValues();
    });
  }

  onSubmit(form) {
    this.showClearButton = true;
    if (this.filterForm.controls.dateFrom.value > this.filterForm.controls.dateTo.value) {
      this.errorRange = true;
      this.filterForm.controls.dateFrom.markAsTouched();
      this.filterForm.controls['dateFrom'].setErrors({'incorrect': true});
      return;
    } else {
      this.errorRange = false;
    }
    this.loading = true;
    this.formSubmit.emit(this.filterForm.getRawValue());
  }

  clear() {
    this.showClearButton = false;
    this.errorDateFrom = false;
    this.errorDateTo = false;
    this.errorRange = false;
    this.loading = false;
    this.form.resetForm();
    this.clearClick.emit();
  }

  resetFilter() {
    this.clear();
    this.filterForm.controls.dateFrom.setValue(currentDate());
    this.filterForm.controls.dateTo.setValue(currentDate());
  }

  onChangeFormValues() {
    this.errorRange = false;
    if (!!this.f.dateFrom.value) {
      if ((!!this.f.clientID.value || !!this.f.operatorUser.value) || (!!this.f.clientID.value && !!this.f.operatorUser.value)) {
        this.f.folio.disable({onlySelf: true, emitEvent: false});
      } else if (!!this.f.folio.value && !this.f.dateTo.value) {
        this.f.dateTo.setValue(this.f.dateFrom.value, {emitEvent: false});
        this.f.dateTo.disable({onlySelf: true, emitEvent: false});
        this.f.clientID.disable({onlySelf: true, emitEvent: false});
        this.f.operatorUser.disable({onlySelf: true, emitEvent: false});
      } else if (!!this.f.folio.value && !!this.f.dateTo.value) {
        this.f.dateTo.setValue(this.f.dateFrom.value, {emitEvent: false});
        this.f.dateTo.disable({onlySelf: true, emitEvent: false});
        this.f.clientID.disable({onlySelf: true, emitEvent: false});
      } else if (!!this.f.dateTo.value && !this.f.folio.value) {
        if (this.f.dateTo.disabled) {
          this.f.dateTo.setValue(undefined, {emitEvent: false});
          this.f.dateTo.enable({onlySelf: true, emitEvent: false});
        } else {
          this.f.folio.disable({onlySelf: true, emitEvent: false});
          this.f.dateTo.enable({onlySelf: true, emitEvent: false});
          this.f.clientID.enable({onlySelf: true, emitEvent: false});
          this.f.operatorUser.enable({onlySelf: true, emitEvent: false});
        }
      } else if (!this.f.dateTo.value && !this.f.folio.value) {
        this.f.dateFrom.enable({onlySelf: true, emitEvent: false});
        this.f.folio.enable({onlySelf: true, emitEvent: false});
      } else if (!this.f.folio.value) {
        this.f.dateTo.enable({onlySelf: true, emitEvent: false});
      } else if (!this.f.operatorUser.value) {
        this.f.folio.enable({onlySelf: true, emitEvent: false});
      }

      if (!this.f.dateTo.value) {
        this.f.dateTo.markAsTouched({onlySelf: true});
        this.f.dateTo.setErrors({'incorrect': true});
      }
    } else if (!!this.f.dateFrom.value) {
      this.f.folio.disable({onlySelf: true, emitEvent: false});
    } else if (!!this.f.operatorUser.value) {
      this.f.folio.disable({onlySelf: true, emitEvent: false});
    } else if (!!this.f.clientID.value) {
      this.f.folio.disable({onlySelf: true, emitEvent: false});
    } else if (!!this.f.folio.value) {
      this.f.dateTo.disable({onlySelf: true, emitEvent: false});
      this.f.clientID.setValue('', {emitEvent: false});
      this.f.clientID.disable({onlySelf: true, emitEvent: false});
      this.f.operatorUser.disable({onlySelf: true, emitEvent: false});
    } else {
      this.f.dateFrom.enable({onlySelf: true, emitEvent: false});
      this.f.dateTo.enable({onlySelf: true, emitEvent: false});
      this.f.folio.enable({onlySelf: true, emitEvent: false});
      this.f.clientID.enable({onlySelf: true, emitEvent: false});
      this.f.operatorUser.enable({onlySelf: true, emitEvent: false});
    }
  }

}
