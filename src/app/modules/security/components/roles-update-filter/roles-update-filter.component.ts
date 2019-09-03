import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroupDirective} from '@angular/forms';
import {MatDialog, MatStepper} from '@angular/material';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {Profile} from '../../../../shared/models';

export interface UserInfo {
  name: string;
  lastName: string;
  displayName: string;
  email: string;
  state: string;
  roles: Profile[];
  userName: string;
}


@Component({
  selector: 'two-roles-update-filter',
  templateUrl: './roles-update-filter.component.html',
  styleUrls: ['./roles-update-filter.component.scss']
})
export class RolesUpdateFilterComponent extends BaseComponent implements OnInit {
  @Input() stepper: MatStepper;
  @Input() readonlyForm: boolean = false;
  @ViewChild('form') form: FormGroupDirective;
  @Output() formSubmit = new EventEmitter();
  @Output() cleanEmitter: EventEmitter<UserInfo> = new EventEmitter();
  loading: boolean;
  error;
  showClean = false;
  filterForm = this.fb.group({
    rol: ['']
  });

  constructor(public dialog: MatDialog, private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    if (this.readonlyForm) {
      this.filterForm.controls.rol.setValue(this.stepper['rolSelected']);
      this.filterForm.controls.rol.disable();
    }
  }

  clean() {
    this.showClean = false;
    this.stepper['rolSelected'] = undefined;
    this.cleanEmitter.emit(undefined);
    this.form.resetForm();
  }

  onSubmit(formValue) {
    this.showClean = true;
    this.stepper['rolSelected'] = formValue.rol;
    this.formSubmit.emit(formValue.rol);
  }
}
