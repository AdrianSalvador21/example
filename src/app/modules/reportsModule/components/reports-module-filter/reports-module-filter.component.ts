import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {BaseComponent} from '../../../../shared/components/base/base.component';

@Component({
  selector: 'two-reports-module-filter',
  templateUrl: './reports-module-filter.component.html',
  styleUrls: ['./reports-module-filter.component.scss']
})
export class ReportsModuleFilterComponent extends BaseComponent implements OnInit {

  @Output() cleanEmitter = new EventEmitter();
  @Output() formDataEmitter = new EventEmitter();

  filterForm = this.fb.group({
    file: [''],
    description: [''],
    report: [''],
    orderBy: ['']
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
  reports = ['AU', 'DV'];
  orderByTypes = [];

  constructor(private fb: FormBuilder, public dialog: MatDialog) {
    super();
  }

  ngOnInit() {
  }

  onSubmit(value) {
    this.showClean = true;
    this.formDataEmitter.emit(this.formToSubmit);
    // discard this line
    this.cleanEmitter.emit(true);
  }
  clean() {
    this.filterForm.reset();
    this.filterForm.markAsUntouched();
    this.filterForm.controls.file.setValue('');
    this.filterForm.controls.report.setValue('');
    this.filterForm.controls.description.setValue('');
    this.filterForm.controls.orderBy.setValue('');
    this.cleanEmitter.emit(false);
    this.showClean = false;
    this.invalidValue = false;
  }
}
