import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, NgForm, Validators} from '@angular/forms';
import {BaseComponent} from '../../../../../shared/components/base/base.component';
import {currentDate} from '../../../../../shared/helpers';

@Component({
  selector: 'two-clarifications-filter',
  templateUrl: './clarifications-filter.component.html',
  styleUrls: ['./clarifications-filter.component.scss']
})
export class ClarificationsFilterComponent extends BaseComponent implements OnInit {
  @ViewChild('form') private form: NgForm;
  @Output()
  showSearch: EventEmitter<boolean> = new EventEmitter;
  @Output()
  cleanSearch: EventEmitter<boolean> = new EventEmitter;
  @Output()
  unitFormEmitter = new EventEmitter();
  @Input() showClean: boolean;
  filterForm = this.fb.group({
    reference: ['', {validators: [Validators.pattern(this.regexAlphaNumeric), Validators.minLength(0)]}],
    cve_rastreo: ['', [Validators.pattern(this.regexAlphaNumericAndSpaces), Validators.minLength(18)]],
    dateFrom: [currentDate(), Validators.required],
    dateTo: [currentDate(), Validators.required],
    orderAccount: ['', [Validators.minLength(11), Validators.pattern(this.regexAlphaNumeric)]],
    clientName: ['', [Validators.pattern(this.regexAlphaNumericAndSpaces), Validators.maxLength(40)]],
    amount: [null, [Validators.min(0.01)]],
    benefAccount: ['', [Validators.minLength(10), Validators.pattern(this.regexNumber)]]
  });

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.filterForm.controls.reference.disable({onlySelf: true, emitEvent: false});
    this.filterForm.controls.cve_rastreo.disable({onlySelf: true, emitEvent: false});
    this.filterForm.controls.amount.setValue(null);
    this.filterForm.valueChanges.subscribe((values) => {
      this.onChangeFormValues();
    });
  }

  get f() {
    return this.filterForm.controls;
  }

  onSubmit(value: any) {
    this.showClean = true;
    this.unitFormEmitter.emit(value);
  }

  clean() {
    this.form.resetForm();
    this.cleanSearch.emit(true);
    this.showClean = false;
  }

  resetAll() {
    this.clean();
    this.filterForm.controls.dateFrom.setValue(currentDate());
    this.filterForm.controls.dateTo.setValue(currentDate());
  }

  onChangeFormValues() {
    if (!!this.f.reference.value || !!this.f.cve_rastreo.value) {
      this.f.dateFrom.disable({onlySelf: true, emitEvent: false});
      this.f.dateTo.disable({onlySelf: true, emitEvent: false});
      this.f.orderAccount.disable({onlySelf: true, emitEvent: false});
      this.f.clientName.disable({onlySelf: true, emitEvent: false});
      this.f.amount.disable({onlySelf: true, emitEvent: false});
      this.f.benefAccount.disable({onlySelf: true, emitEvent: false});

      this.f.orderAccount.setValue('', {emitEvent: false});
      this.f.clientName.setValue('', {emitEvent: false});
      this.f.amount.setValue(null, {emitEvent: false});
      this.f.benefAccount.setValue('', {emitEvent: false});

      if (!!this.f.reference.value) {
        this.f.cve_rastreo.disable({onlySelf: true, emitEvent: false});
      } else {
        this.f.reference.disable({onlySelf: true, emitEvent: false});
      }
    } else if (!!this.f.dateFrom.value || !!this.f.dateTo.value) {
      this.f.reference.disable({onlySelf: true, emitEvent: false});
      this.f.cve_rastreo.disable({onlySelf: true, emitEvent: false});
    } else {
      this.f.cve_rastreo.enable({onlySelf: true, emitEvent: false});
      this.f.reference.enable({onlySelf: true, emitEvent: false});
      this.f.dateFrom.enable({onlySelf: true, emitEvent: false});
      this.f.dateTo.enable({onlySelf: true, emitEvent: false});
      this.f.orderAccount.enable({onlySelf: true, emitEvent: false});
      this.f.clientName.enable({onlySelf: true, emitEvent: false});
      this.f.amount.enable({onlySelf: true, emitEvent: false});
      this.f.benefAccount.enable({onlySelf: true, emitEvent: false});
    }
  }

  get isValidForm() {
    return this.filterForm.valid && (!this.f.dateFrom.value && !this.f.dateTo.value || this.f.dateFrom.value <= this.f.dateTo.value);
  }
}
