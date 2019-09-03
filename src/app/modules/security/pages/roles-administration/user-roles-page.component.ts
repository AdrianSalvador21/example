import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroupDirective, Validators} from '@angular/forms';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {AuthenticationService} from '../../../../core/services';
import {MatDialog} from '@angular/material';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {MODAL_SIZE} from '../../../../shared/helpers';
import {AppConfig} from '../../../../configs/app.config';
import {AlterDialog} from '../../../../shared/components/alter-dialog/alter-dialog.component';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';

@Component({
  selector: 'two-roles-administration-page',
  templateUrl: './user-roles-page.component.html',
  styleUrls: ['./user-roles-page.component.scss']
})

export class UserRolesPageComponent extends BaseComponent {
  @ViewChild('form') form: FormGroupDirective;
  loading: boolean;
  error;
  user: any;
  filterForm = this.fb.group({
    userName: ['', [Validators.required]]
  });
  displayedColumns: string[] = ['profileGroup', 'enabled', 'remove', 'main'];
  allRoles;

  constructor(public dialog: MatDialog, private fb: FormBuilder, private authenticationService: AuthenticationService) {
    super();
  }

  onSubmit(form) {
    this.loading = true;
    if (AppConfig.useActiveDirectory) {
      this.authenticationService.getUser(form.userName).subscribe((response) => {
        if (response.errorCode === '0' && !!response.data && !!response.data[0] && !!response.data[0][0]) {
          this.user = {
            userName: form.userName,
            name: response.data[0][0].firstName,
            lastName: response.data[0][0].lastName,
            displayName: response.data[0][0].displayName,
            email: response.data[0][0].email,
            state: response.data[0][0].status,
            roles: undefined
          };
          this.loadRoles();
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
      this.user = {
        userName: form.userName,
        name: 'Pepe',
        lastName: 'Corbina',
        displayName: 'Pepe Corbina',
        email: 'test@test.com',
        state: 'Activo',
        roles: undefined
      };
      this.loadRoles();
    }
  }

  loadRoles() {
    this.loading = true;
    this.authenticationService.getProfileGroupsByUser(this.user.userName).subscribe((response) => {
      if (response.errorCode === '0' && !!response.data[0]) {
        this.authenticationService.getProfileGroups().subscribe((responseProfGroups) => {
          if (responseProfGroups.errorCode === '0' && !!responseProfGroups.data[0]) {
            this.user.roles = response.data[0];
            this.allRoles = responseProfGroups.data[0];
            this.loading = false;
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
    this.user = undefined;
    this.form.resetForm();
    this.allRoles = undefined;
  }

  removeRole(data) {
    const dialogRef = this.dialog.open(AlterDialog, {
      width: MODAL_SIZE.width,
      height: MODAL_SIZE.height,
      data: {message: 'security.roles.delete-message', date: undefined}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Y') {
        if (data.enabled === '1') {
          this.user.roles = this.user.roles.filter(role => role !== data);
          if (this.user.roles.length > 0 && !this.user.roles.some(role => role.mainProfileGroup === '1' && role.enabled === '1')) {
            this.user.roles.filter(role => role.enable() === '1')[0].mainProfileGroup = '1';
          }
        }
      } else {
        return;
      }
    });
  }

  addRole() {
    this.user.roles.push({
      enabled: '1',
      mainProfileGroup: this.user.roles.some(rol => rol.enabled === '1') ? '0' : '1',
      profileGroup: '',
      profileGroupDescription: ''
    });
    this.user.roles = [...this.user.roles];
  }

  setMainRole(data) {
    if (data.enabled === '1') {
      this.user.roles.forEach((userRole: any) => {
        if (userRole.profileGroup === data.profileGroup) {
          userRole.mainProfileGroup = '1';
        } else {
          userRole.mainProfileGroup = '0';
        }
      });
      this.user.roles = [...this.user.roles];
    }
  }

  getRoles(roleId: string) {
    return this.allRoles.filter((role: any) => {
      return !this.user.roles || !this.user.roles.some((userRole: any) => {
        return role.PROFILEGROUPID !== roleId && userRole.profileGroup === role.PROFILEGROUPID;
      });
    });
  }

  isValid() {
    return !this.user.roles.some((role) => role.profileGroup === '');
  }

  save() {
    let mainProfileGroup = '';
    let profileGroups = '';
    this.user.roles.forEach((role) => {
      if (role.mainProfileGroup === '1') {
        mainProfileGroup = role.profileGroup;
      }
      profileGroups += profileGroups === '' ? role.profileGroup : ';' + role.profileGroup;
    });


    const dialogRef = this.dialog.open(AlterDialog, {
      width: MODAL_SIZE.width,
      height: MODAL_SIZE.height,
      disableClose: true,
      data: {message: 'security.role.save-changes-confirmation'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Y') {
        this.loading = true;
        this.authenticationService.setProfileGroupsToUser(this.user.userName, profileGroups, mainProfileGroup).subscribe((response) => {
          if (!!response && response.errorCode === '0') {
            this.user.roles = undefined;
            this.loadRoles();
            this.dialog.open(MessageDialog, {
              width: MODAL_SIZE.width,
              height: MODAL_SIZE.height,
              data: {message: 'security.role.success'}
            });
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
        return;
      }
    });
  }
}
