import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {BaseComponent} from '../../../../shared/components/base/base.component';

@Component({
  selector: 'two-beneficiaries-pld-filter',
  templateUrl: './beneficiaries-pld-filter.component.html',
  styleUrls: ['./beneficiaries-pld-filter.component.scss']
})
export class BeneficiariesPldFilterComponent extends BaseComponent implements OnInit {
  @Output() cleanEmitter = new EventEmitter();
  @Output() formDataEmitter = new EventEmitter();
  @Output() initialSearch = new EventEmitter();
  @Input() hasRecords: boolean;

  filterForm = this.fb.group({
    client: ['', [Validators.pattern(this.regexAlphaNumeric), Validators.maxLength(9), Validators.minLength(9)]],
    benefType: ['N'],
    status: ['IN_VALIDATION']
  });

  enabledButton = false;

  invalid = false;
  showClean = false;

  status = ['ACTIVE', 'INACTIVE_PLD', 'IN_VALIDATION'];
  types = ['N', 'I'];

  constructor(private fb: FormBuilder, public dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    this.initialSearch.emit(this.filterForm.getRawValue());
    this.filterForm.valueChanges.subscribe(() => {
      this.validForm();
    });
  }

  onSubmit(value) {
    this.showClean = true;
    this.formDataEmitter.emit(this.filterForm.getRawValue());
  }

  validForm() {
    if (!this.filterForm.controls.client.value && this.filterForm.controls.client.invalid) {
      this.invalid = true;
      this.enabledButton = false;
      return false;
    }
    if (this.filterForm.controls.client.invalid) {
      this.invalid = true;
      this.enabledButton = false;
      return false;
    } else {
      this.invalid = false;
      this.enabledButton = true;
      return true;
    }
  }

  clean() {
    this.filterForm.reset();
    this.filterForm.markAsUntouched();
    this.filterForm.controls.benefType.setValue('N', {emitEvent: false});
    this.filterForm.controls.status.setValue('IN_VALIDATION', {emitEvent: false});
    this.filterForm.controls.client.setValue('', {emitEvent: false});
    this.cleanEmitter.emit(false);
    this.showClean = false;
    this.hasRecords = false;
  }
}
