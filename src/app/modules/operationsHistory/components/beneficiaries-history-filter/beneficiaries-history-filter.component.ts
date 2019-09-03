import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Beneficiary} from '../../../../shared/models';
import {FormBuilder, FormGroupDirective, Validators} from '@angular/forms';
import {BeneficiaryService} from '../../../../core/services';
import {MatDialog} from '@angular/material';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';
import {MODAL_SIZE} from '../../../../shared/helpers';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {BaseComponent} from '../../../../shared/components/base/base.component';

@Component({
  selector: 'two-beneficiaries-history-filter',
  templateUrl: './beneficiaries-history-filter.component.html',
  styleUrls: ['./beneficiaries-history-filter.component.scss']
})
export class BeneficiariesHistoryFilterComponent extends BaseComponent implements OnInit {

  error;
  loading;
  showDetail = false;
  @ViewChild('form') filter: FormGroupDirective;
  @Input() showClearButton: boolean;
  @Output() beneficiaryFounded = new EventEmitter<Beneficiary>();
  filterForm = this.fb.group({
    clientID: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(this.regexNumber)]],
    benefAccount: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(18), Validators.pattern(this.regexNumber)]],
    benefType: ['', [Validators.required]]
  });

  benefTypes = ['I', 'N'];
  @Output() cleanData = new EventEmitter<any>();
  @Output() formSubmit = new EventEmitter();

  constructor(private fb: FormBuilder, private beneficiaryService: BeneficiaryService, public dialog: MatDialog) {
    super();
  }

  get f() {
    return this.filterForm.controls;
  }

  get isValidForm() {
    return this.filterForm.valid && ( !!this.f.clientID.value || !!this.f.benefAccount.value && !!this.f.benefType.value);
  }

  ngOnInit() {
    this.filterForm.valueChanges.subscribe((values) => {
      this.onChangeFormValues(values);
    });
  }

  onSubmit() {
    const formData = this.filterForm.getRawValue();
    this.formSubmit.emit(formData);
  }

  onChangeFormValues(values: any) {
    // if (!!values.alias) {
    //   this.f.accountNumber.disable({onlySelf: true, emitEvent: false});
    // } else if (!!values.accountNumber) {
    //   this.f.alias.disable({onlySelf: true, emitEvent: false});
    // } else {
    //   this.f.accountNumber.enable({onlySelf: true, emitEvent: false});
    //   this.f.alias.enable({onlySelf: true, emitEvent: false});
    // }
  }

  clean() {
    this.cleanData.emit();
    this.showDetail = false;
    this.filter.resetForm();
  }

}
