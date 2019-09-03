import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatStepper} from '@angular/material';
import {AuthenticationService} from '../../../../core/services';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {MODAL_SIZE} from '../../../../shared/helpers';
import {TranslateService} from '@ngx-translate/core';
import {AlterDialog} from '../../../../shared/components/alter-dialog/alter-dialog.component';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';

@Component({
  selector: 'two-menu-update-grid',
  templateUrl: './menu-update-grid.component.html',
  styleUrls: ['./menu-update-grid.component.scss']
})
export class MenuUpdateGridComponent implements OnInit {
  @Input() stepper: MatStepper;
  @Input() fullMenu: any;
  @Output() returnOutput = new EventEmitter();
  data: any[] = [];
  dataBase: any[] = [];
  profiles: any;
  displayedColumnsArray = [];
  loading;

  constructor(public authenticationService: AuthenticationService, public dialog: MatDialog, public translateService: TranslateService) {
  }

  ngOnInit() {
    this.data = this.stepper['data'];
    this.dataBase = this.stepper['dataBase'];
    this.profiles = this.stepper['profiles'];
    (<Array<any>>this.fullMenu).sort((a, b) => {
      return (<number>a.ORDINAL) - (<number>b.ORDINAL);
    });

    this.fullMenu.forEach(menuItem => {
      if (menuItem['PARENTID'] === '-1') {
        let displayedColumns = ['PROFILEGROUPID', menuItem['NODEID']];
        this.fullMenu.forEach(menuSubItem => {
          if (menuSubItem['PARENTID'] === menuItem['NODEID']) {
            displayedColumns.push(menuSubItem['NODEID']);
          }
        });
        displayedColumns.push('HOME_SELECT');
        this.displayedColumnsArray.push(displayedColumns);
      }
    });

    /*this.displayedColumnsArray.push('PROFILEGROUPID', 'HOME_SELECT');*/
    this.createData();
  }

  returnBack() {
    this.stepper.previous();
  }

  createData() {
    this.data.forEach(profileGroup => {
      this.fullMenu.forEach(menuItem => {
        profileGroup[menuItem['NODEID']] = {
          parentID: menuItem.PARENTID,
          status: profileGroup.DATAMENU.includes(menuItem['NODEID']),
          text: menuItem.TEXT,
          children: []
        };
        this.fullMenu.forEach(menuSubItem => {
          if (menuItem['NODEID'] === menuSubItem['PARENTID']) {
            profileGroup[menuItem['NODEID']]['children'].push(menuSubItem);
          }
        });
      });
    });
  }

  changeCheckValue(item, selectedField, checked) {
    item[selectedField]['status'] = checked;
    this.fullMenu.forEach(menuItem => {
      if (menuItem.NODEID === selectedField && menuItem.PARENTID === '-1') {
        return;
      } else if (menuItem.NODEID === selectedField) {
        let parentId = menuItem.PARENTID;
        let children = this.fullMenu.filter((child)=> child.PARENTID === parentId);
        if(children.some((child)=>item[child.NODEID]['status'])){
          item[parentId]['status'] = true;
        }else{
          item[parentId]['status'] = false;
        }
        return;
      }
    });
    if (item.DATAMENUHOME === selectedField && !checked) {
      this.fullMenu.forEach(menuItem => {
        Object.keys(item).forEach(key => {
          if (menuItem.NODEID === key) {
            if (item[key].status === true && item[key].children.length === 0) {
              item.DATAMENUHOME = key;
              return;
            }
          }
        });
      });
    } else {
      if (item.DATAMENUHOME !== '') {
        if (!item[item.DATAMENUHOME].status) {
          this.fullMenu.forEach(menuItem => {
            Object.keys(item).forEach(key => {
              if (menuItem.NODEID === key) {
                if (item[key].status === true && item[key].parentID !== '-1') {
                  item.DATAMENUHOME = key;
                }
              }
            });
          });
        }
      } else {
        this.fullMenu.forEach(menuItem => {
          Object.keys(item).forEach(key => {
            if (menuItem.NODEID === key) {
              if (item[key].status === true && item[key].parentID !== '-1') {
                item.DATAMENUHOME = key;
              }
            }
          });
        });
      }
    }
  }

  setChecked(item, data) {
    let checked = false;
    let disabledParent = 0;
    if (data.children.length !== 0) {
      data.children.forEach(dataItem => {
        if (item[dataItem['NODEID']].status) {
          checked = true;
        } else {
          disabledParent += 1;
        }
      });
      data.status = !(disabledParent !== 0 && disabledParent === data.children.length);
      return checked;
    }
    return !!data.status;
  }

  createRequest(data) {
    const profileGroups = [];
    data.forEach(register => {
      const selectedProfiles = [];
      const selectedMenus = [];
      const profileGroup = {
        profileGroupId: register.PROFILEGROUPID,
        enabled: register.ENABLED,
        mainMenu: register.DATAMENUHOME,
        menus: '',
        profiles: ''
      };
      this.profiles.forEach(profile => {
        Object.keys(register).forEach(key => {
          if (profile.id === key) {
            if (register[key]) {
              selectedProfiles.push(key);
            }
          }
        });
      });
      this.fullMenu.forEach(menuItem => {
        Object.keys(register).forEach(key => {
          if (menuItem.NODEID === key) {
            if (register[key].status) {
              selectedMenus.push(key);
            }
          }
        });
      });
      profileGroup.menus = selectedMenus.join(';');
      profileGroup.profiles = selectedProfiles.join(';');
      profileGroups.push(profileGroup);
    });
    return profileGroups;
  }

  updateRoles() {
    this.data.forEach(item => {
      this.dataBase[item.index] = item;
    });

    const dialogRef = this.dialog.open(AlterDialog, {
      width: MODAL_SIZE.width,
      height: MODAL_SIZE.height,
      disableClose: true,
      data: {message: 'security.roles.confirm-question', date: undefined}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Y') {
        this.loading = true;
        const requestData = this.createRequest(this.dataBase);
        this.authenticationService.inupProfileGroups(requestData).subscribe(inupResponse => {
          this.loading = false;
          if (inupResponse.errorCode === '0') {
            const dialogRefConfirm = this.dialog.open(MessageDialog, {
              width: MODAL_SIZE.width,
              height: MODAL_SIZE.height,
              disableClose: true,
              data: {message: 'security.role.success', folio: this.stepper['folio']}
            });
            dialogRefConfirm.afterClosed().subscribe((evt) => {
              this.returnOutput.emit();
              this.stepper.reset();
              }
            );
          } else {
            this.dialog.open(ErrorDialog, {
              width: MODAL_SIZE.width,
              height: MODAL_SIZE.height,
              disableClose: true,
              data: {error: 'security.roles.delete-error'}
            });
          }
        });
      } else {
        return;
      }
    });
  }

  invalidForm() {
    let disabled = false;
    let falseCount = 0;
    this.data.forEach(dataItem => {
      falseCount = 0;
      this.fullMenu.forEach(menuItem => {
        Object.keys(dataItem).forEach(key => {
          if (menuItem.NODEID === key) {
            if (dataItem[key].status === false) {
              falseCount += 1;
            }
          }
        });
      });
      if (falseCount === Object.keys(this.fullMenu).length) {
        setTimeout(() => {
          disabled = true;
        });
      }
    });
    setTimeout(() => {
      return disabled;
    });
  }

  getTabTitle(nodeId) {
    for (let menuItem of this.fullMenu) {
      if (menuItem['NODEID'] === nodeId) {
        return this.translateService.instant(menuItem['TEXT']);
      }
    }
  }
}
