import {Component, Input, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {AuthenticationService} from '../../../../core/services';
import {MatDialog, MatSlideToggle, MatStepper} from '@angular/material';
import {AlterDialog} from '../../../../shared/components/alter-dialog/alter-dialog.component';
import {MODAL_SIZE} from '../../../../shared/helpers';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';

@Component({
  selector: 'two-roles-update-grid',
  templateUrl: './roles-update-grid.component.html',
  styleUrls: ['./roles-update-grid.component.scss']
})
export class RolesUpdateGridComponent implements OnInit {
  @Input() stepper: MatStepper;

  loading = false;
  profiles = [
    {id: 'PLD_OPERATIONS'},
    {id: 'APPROVER'},
    {id: 'AMOUNT_APPROVER'},
    {id: 'CONSULTIVE'},
    {id: 'DATA_CAPTURE'},
    {id: 'ADMINISTRATOR'}
  ];

  readOnlyRoles = ['Administrador'];

  displayedColumns: string[] = ['PROFILEGROUPID', 'ENABLED', 'edit', 'remove'];
  itemSelected: any;
  data: any[] = [];
  dataBase: any[] = [];

  constructor(public authenticationService: AuthenticationService, public dialog: MatDialog) {
    this.getProfileGroups();
  }

  ngOnInit() {
  }

  getProfileGroups() {
    this.loading = true;
    this.data = [];
    this.dataBase = [];
    this.authenticationService.getProfileGroups().subscribe(profileGroups => {
      this.loading = false;
      if (profileGroups.data[0].length !== 0) {
        this.dataBase = this.createData(profileGroups.data[0]);
        this.data = [...this.dataBase];
      }
    }, error => {
      console.error(error);
      this.loading = false;
    });
  }

  createData(rolesData) {
    rolesData.forEach((rolData, index) => {
      rolData['index'] = index;
      rolData['newElement'] = false;
      this.profiles.forEach(profile => {
        rolData[profile.id] = rolData.DATAPROFILE.includes(profile.id);
      });
    });
    return rolesData;
  }


  changeCheckValue(item, selectedField, checked) {
    item[selectedField] = checked;
  }


  changeEnabledStatus(item, checked, toggle) {
    const message = checked ? 'security.roles.enabled-message' : 'security.roles.disabled-message';
    const dialogRef = this.dialog.open(AlterDialog, {
      width: MODAL_SIZE.width,
      height: MODAL_SIZE.height,
      data: {message: message, date: undefined}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Y') {
        this.loading = true;
        item.ENABLED = checked ? '1' : '0';
        this.authenticationService.enableProfileGroup(item.PROFILEGROUPID, item.ENABLED).subscribe(enableResponse => {
          this.loading = false;
          if (enableResponse.errorCode !== '') {
            // set error
          } else {
            const dialogRefConfirm = this.dialog.open(MessageDialog, {
              width: MODAL_SIZE.width,
              height: MODAL_SIZE.height,
              disableClose: true,
              data: {message: 'security.role.success'}
            });
          }
        });
      } else {
        toggle.toggle();
        return;
      }
    });

  }

  continue() {
    this.stepper['data'] = this.data;
    this.stepper['dataBase'] = this.dataBase;
    this.stepper['profiles'] = this.profiles;
    this.stepper.next();
  }

  deleteItem(item) {
    if (item.newElement) {
      this.data.splice(item.index, 1);
      this.dataBase.splice(item.index, 1);
      const auxData = [...this.data];
      this.data = [];
      this.data = [...auxData];
      return;
    }
    const dialogRef = this.dialog.open(AlterDialog, {
      width: MODAL_SIZE.width,
      height: MODAL_SIZE.height,
      data: {message: 'security.roles.delete-message', date: undefined}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Y') {
        const dataIndex = this.data.indexOf(item);
        let dataBaseIndex = -1;
        const profileGroup = item.PROFILEGROUPID;
        this.authenticationService.deleteProfileGroup(profileGroup).subscribe(deleteResponse => {
          this.data.splice(dataIndex, 1);
          const auxData = [...this.data];
          this.data = [];
          this.data = [...auxData];
          this.dataBase.forEach((element, index) => {
            if (element.PROFILEGROUPID === item.PROFILEGROUPID) {
              dataBaseIndex = index;
            }
          });
          this.dataBase.splice(dataBaseIndex, 1);
        }, error => {
          console.error(error);
          this.dialog.open(ErrorDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            data: {error: 'security.roles.update-error'}
          });
        });
      } else {
        return;
      }
    });
  }

  filterData(filterData) {
    this.data = [...this.dataBase];
    this.data = this.data.filter(item => item.PROFILEGROUPID.toLowerCase() === filterData.toLowerCase());

    if (this.data.length === 0) {
      const dialogRef = this.dialog.open(MessageDialog, {
        width: MODAL_SIZE.width,
        height: MODAL_SIZE.height,
        data: {message: 'general.noRolFound'}
      });

      this.data = [...this.dataBase];
    }
  }

  updateData() {
    this.getProfileGroups();
  }

  restoreData() {
    this.data = [];
    this.data = [...this.dataBase];
  }


  addProfile() {
    const newProfile = {
      'PROFILEGROUPID': '',
      'DATAMENUHOME': '',
      'ENABLED': '1',
      'index': this.dataBase.length,
      'DATAMENU': [],
      'DATAPROFILE': [],
      'newElement': true
    };
    this.profiles.forEach(profile => {
      newProfile[profile.id] = false;
    });
    this.stepper['selectedItem'] = newProfile;
    this.stepper['data'] = this.data;
    this.stepper['dataBase'] = this.dataBase;
    this.stepper.next();
  }

  invalidForm() {
    let disabled = false;
    let falseCount = 0;
    let emptyValue = 0;
    this.data.forEach(dataItem => {
      if (dataItem['PROFILEGROUPID'] === '') {
        emptyValue += 1;
      }
      falseCount = 0;
      this.profiles.forEach(profile => {
        Object.keys(dataItem).forEach(key => {
          if (profile.id === key) {
            if (dataItem[key] === false) {
              falseCount += 1;
            }
          }
        });
      });
      if (falseCount === Object.keys(this.profiles).length || emptyValue !== 0) {
        disabled = true;
      }
    });

    return disabled;
  }

  changeNewInput(index, event) {
    this.data[index].PROFILEGROUPID = event.target.value;
    this.dataBase[index].PROFILEGROUPID = event.target.value;
  }

  editItem(selectedItem) {
    this.stepper['selectedItem'] = selectedItem;
    this.stepper['data'] = this.data;
    this.stepper['dataBase'] = this.dataBase;
    this.stepper.next();
  }

  isReadOnlyRole(item): boolean {
    return this.readOnlyRoles.indexOf(item.PROFILEGROUPID) >  -1;
  }
}
