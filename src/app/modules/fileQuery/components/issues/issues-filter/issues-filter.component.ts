import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroupDirective, Validators} from '@angular/forms';
import {BaseComponent} from '../../../../../shared/components/base/base.component';
import {currentDate} from '../../../../../shared/helpers';


@Component({
  selector: 'two-issues-filter',
  templateUrl: './issues-filter.component.html',
  styleUrls: ['./issues-filter.component.scss']
})
export class IssuesFilterComponent extends BaseComponent implements OnInit {
  @Output()
  showSearchEmitter = new EventEmitter;
  @Output()
  formDataEmitter = new EventEmitter;
  showClean = false;
  formToSubmit: any;
  @ViewChild('form') form: FormGroupDirective;
  filterForm = this.fb.group({
    cve_rastreo: ['', [Validators.pattern(this.regexAlphaNumeric), Validators.maxLength(18), Validators.minLength(18)]],
    dateTo: [currentDate(), Validators.required],
    dateFrom: [currentDate(), Validators.required],
    reference: ['', [Validators.pattern(this.regexNumber), Validators.maxLength(20), Validators.minLength(0)]]
  });

  get f() {
    return this.filterForm.controls;
  }

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.filterForm.controls.reference.disable({onlySelf: true, emitEvent: false});
    this.filterForm.controls.cve_rastreo.disable({onlySelf: true, emitEvent: false});
    this.filterForm.valueChanges.subscribe((values => {
      this.onChangeFormValues();
    }));
  }

  onSubmit() {
    this.showClean = true;
    if (this.filterForm.controls.dateFrom.value == '' || this.filterForm.controls.dateTo.value == '') {
      this.formToSubmit = this.filterForm.getRawValue();
      this.formToSubmit.dateFrom = currentDate();
      this.formToSubmit.dateTo = currentDate();
      this.formDataEmitter.emit(this.formToSubmit);
    } else {
      this.showClean = true;
      this.formToSubmit = this.filterForm.getRawValue();
      this.formToSubmit.dateFrom = this.filterForm.controls.dateFrom.value;
      this.formToSubmit.dateTo = this.filterForm.controls.dateTo.value;
      this.formDataEmitter.emit(this.formToSubmit);
    }
  }

  clean() {
    this.form.resetForm();
    this.showClean = false;
    this.showSearchEmitter.emit(false);
  }

  onChangeFormValues() {
    if (!!this.f.reference.value || !!this.f.cve_rastreo.value) {
      this.f.dateFrom.disable({onlySelf: true, emitEvent: false});
      this.f.dateTo.disable({onlySelf: true, emitEvent: false});

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
    }
  }

  get isValidForm() {
    return this.filterForm.valid && (!this.f.dateFrom.value && !this.f.dateTo.value || this.f.dateFrom.value <= this.f.dateTo.value);
  }
}
