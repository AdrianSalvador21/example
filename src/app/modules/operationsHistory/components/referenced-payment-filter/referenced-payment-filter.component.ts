import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroupDirective, Validators} from '@angular/forms';
import {currentDate} from '../../../../shared/helpers';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {AppConfig} from '../../../../configs/app.config';

@Component({
  selector: 'two-referenced-payment-history-filter',
  templateUrl: './referenced-payment-filter.component.html',
  styleUrls: ['./referenced-payment-filter.component.scss']
})
export class ReferencedPaymentFilterComponent extends BaseComponent implements OnInit {
  @ViewChild('form') form: FormGroupDirective;
  @Output() formSubmit = new EventEmitter();
  @Output() clearClick = new EventEmitter();
  @Input() showClearButton: boolean;
  loading: boolean;
  maxDateForm;
  filterForm = this.fb.group({
    clientID: ['', [Validators.minLength(9)]],
    channel: [''],
    dateFrom: [currentDate(), [Validators.required]],
    dateTo: [currentDate(), [Validators.required]],
    folio: ['']
  });

  channels = ['ADAPTOR', 'Internet'];

  get f() {
    return this.filterForm.controls;
  }

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.filterForm.controls.dateFrom.setValue(currentDate().subtract(1, 'days'), {emitEvent: false});
    this.filterForm.controls.dateTo.setValue(currentDate().subtract(1, 'days'), {emitEvent: false});
    this.maxDateForm = currentDate().subtract(1, 'days');
  }

  onSubmit() {
    const formData = this.filterForm.getRawValue();
    formData.dateTo = formData.dateTo.format(AppConfig.dateFormat);
    formData.dateFrom = formData.dateFrom.format(AppConfig.dateFormat);
    this.formSubmit.emit(formData);
  }

  cleanForm() {
    this.form.resetForm();
    this.clearClick.emit();
    this.showClearButton = false;
  }

  cleanFormInitial() {
    this.cleanForm();
    this.filterForm.controls.dateFrom.setValue(currentDate().subtract(1, 'days'), {emitEvent: false});
    this.filterForm.controls.dateTo.setValue(currentDate().subtract(1, 'days'), {emitEvent: false});
  }
}
