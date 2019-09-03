import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroupDirective, Validators} from '@angular/forms';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {AuthenticationService} from '../../../../core/services';
import {Profile} from '../../../../shared/models';
import {MatDialog} from '@angular/material';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {MODAL_SIZE} from '../../../../shared/helpers';
import {AppConfig} from '../../../../configs/app.config';
import {UserInfo} from '../roles-update-filter/roles-update-filter.component';

@Component({
  selector: 'two-security-profile-filter',
  templateUrl: './profile-filter.component.html',
  styleUrls: ['./profile-filter.component.scss']
})

export class ProfileFilterComponent extends BaseComponent {
  @ViewChild('form') form: FormGroupDirective;
  @Output() formSubmit = new EventEmitter();
  @Output() showDetailEmitter: EventEmitter<UserInfo> = new EventEmitter();
  loading: boolean;
  error;
  showDetail = false;
  filterForm = this.fb.group({
    userName: ['', [Validators.required]]
  });

  constructor(public dialog: MatDialog, private fb: FormBuilder, private authenticationService: AuthenticationService) {
    super();
  }

  onSubmit(form) {
    this.showDetailEmitter.emit(undefined);
    this.loading = true;
    if (AppConfig.useActiveDirectory) {
      this.authenticationService.getUser(form.userName).subscribe((response) => {
        if (response.errorCode === '0' && !!response.data && !!response.data[0] && !!response.data[0][0]) {
          let user: UserInfo = {
            userName: form.userName,
            name: response.data[0][0].firstName,
            lastName: response.data[0][0].lastName,
            displayName: response.data[0][0].displayName,
            email: response.data[0][0].email,
            state: response.data[0][0].status,
            roles: undefined
          };
          this.getRoles(user);
        } else if (response.errorCode === '-50002') {
          this.dialog.open(ErrorDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {error: 'errors.no-found'}
          });
          this.loading = false;
          return;
        } else {
          this.dialog.open(ErrorDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {error: 'errors.genericError'}
          });
          this.loading = false;
          return;
        }
      });
    } else {
      let user: UserInfo = {
        userName: form.userName,
        name: 'Pepe',
        lastName: 'Corbina',
        displayName: 'Pepe Corbina',
        email: 'test@test.com',
        state: 'Activo',
        roles: undefined
      };
      this.getRoles(user);
    }
  }

  getRoles(user: UserInfo) {
    this.authenticationService.getRoles(user.userName).subscribe((response) => {
      if (response.errorCode === '0' && !!response.data[0]) {
        let roles = [];
        let data = response.data[0];
        for (let i = 0; i < data.length; i++) {
          Object.keys(Profile).forEach((key) => {
            if (Profile[key] == data[i].roleId) {
              roles.push(Profile[key]);
              return;
            }
          });
        }
        user.roles = roles;
        this.showDetail = true;
        this.showDetailEmitter.emit(user);
        this.loading = false;
        return;
      } else {
        this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: 'errors.genericError'}
        });
        this.loading = false;
        return;
      }
    });
  }

  clean() {
    this.showDetail = false;
    this.showDetailEmitter.emit(undefined);
    this.form.resetForm();
  }
}
