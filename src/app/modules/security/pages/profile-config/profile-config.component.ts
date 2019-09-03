import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatStepper} from '@angular/material';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {AuthenticationService} from '../../../../core/services';
import {AlterDialog} from '../../../../shared/components/alter-dialog/alter-dialog.component';
import {MODAL_SIZE} from '../../../../shared/helpers';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {BaseComponent} from '../../../../shared/components/base/base.component';

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'two-profile-config',
  templateUrl: './profile-config.component.html',
  styleUrls: ['./profile-config.component.scss']
})
export class ProfileConfigComponent extends BaseComponent implements OnInit {
  @ViewChild('tree') tree;
  @Input() stepper: MatStepper;
  @Output() returnOutput = new EventEmitter();
  data: any;
  selectedItem: any;
  loading = false;
  fullMenu: any;
  menu: any;
  filteredMenu: any;
  treeControl: any;
  treeFlattener: any;
  dataSource: any;
  availableMenus = [];
  availableMenusCount = 0;
  enableButton = true;

  profiles = [{id: 'APPROVER'},
              {id: 'AMOUNT_APPROVER'},
              {id: 'CONSULTIVE'},
              {id: 'DATA_CAPTURE'},
              {id: 'ADMINISTRATOR'}];

  constructor(public authenticationService: AuthenticationService, public dialog: MatDialog) {
    super();
    this.treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

    this.treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  ngOnInit() {
    this.loading = true;
    this.selectedItem = {...this.stepper['selectedItem']};
    this.data = this.stepper['data'];
    this.authenticationService.getFullMenu().subscribe(fullMenu => {
      this.fullMenu = fullMenu.data[0];
      this.fullMenu.forEach(menuItem => {
        this.selectedItem[menuItem['NODEID']] = {
          parentID: menuItem.PARENTID,
          status: this.selectedItem.DATAMENU.includes(menuItem['NODEID']),
          text: menuItem.TEXT,
          children: []
        };
        this.fullMenu.forEach(menuSubItem => {

          if (menuItem['PARENTID'] === menuSubItem['NODEID']) {
            menuItem['PARENTINFO'] = menuSubItem;
          }

          if (menuItem['NODEID'] === menuSubItem['PARENTID']) {
            this.selectedItem[menuItem['NODEID']]['children'].push(menuSubItem);
          }
        });
      });
      this.menu = [...this.fullMenu];
      this.filteredMenu = this.createMenuData();
      this.updateMenu();
      this.loading = false;
    });
  }

  returnBack() {
    this.stepper.reset();
  }

  changeCheckValue(profileId, checked) {
    this.selectedItem[profileId] = checked;
    this.updateMenu();
    this.availableMenusUpdate();

  }

  updateMenu() {
    const dynamicMenu = [];
    this.profiles.forEach(profile => {
      if (this.selectedItem[profile.id]) {
        this.fullMenu.forEach(menuItem => {
          if (menuItem.ALLOWED_PROFILES.includes(profile.id) && !dynamicMenu.includes(menuItem)) {
            dynamicMenu.push(menuItem);
          }
        });
      }
    });
    this.menu = dynamicMenu;
    this.filteredMenu = this.createMenuData();
    this.dataSource.data = this.filteredMenu;
    this.tree.treeControl.expandAll();
  }

  availableMenusUpdate() {
    this.availableMenus = [];
    this.filteredMenu.forEach(filteredItem => {
      this.availableMenus.push(filteredItem.NODEID);
      if (filteredItem.children.length !== 0) {
        filteredItem.children.forEach(child => {
          this.availableMenus.push(child.NODEID);
        });
      }
    });
    if (this.availableMenus.length == 0 || !this.availableMenus.includes(this.selectedItem.DATAMENUHOME)) {
      this.selectedItem.DATAMENUHOME = '';
    }

    this.fullMenu.forEach(menuItem => {
      Object.keys(this.selectedItem).forEach(key => {
        if (key === menuItem.NODEID) {
          if (!this.availableMenus.includes(key)) {
            this.selectedItem[key].status = false;
          }
        }
      });
    });
  }

  createMenuData() {
    const menuData = [];
    this.menu.forEach(menuItem => {
      if (menuItem['PARENTID'] === '-1') {
        menuItem.children = [];
        this.menu.forEach(menuSubItem => {
          if (menuSubItem['PARENTID'] === menuItem['NODEID']) {
            menuItem.children.push(menuSubItem);
          }
        });
        menuData.push(menuItem);
      }
    });
    return menuData;
  }

  changeMenuValue(node, checked) {
    this.availableMenusCount = 0;
    this.selectedItem[node.NODEID].status = checked;

    setTimeout(() => {
      this.menu.forEach(menuItemCount => {
        Object.keys(this.selectedItem).forEach(key => {
          if (menuItemCount.NODEID === key) {
            if (this.selectedItem[key].status === true) {
              this.availableMenusCount += 1;
            }
          }
        });
      });

      if (this.availableMenusCount === 0) {
        this.enableButton = false;
        this.selectedItem.DATAMENUHOME = '';
      } else {
        this.enableButton = true;
      }
    }, 200);


    this.menu.forEach(menuItem => {
      if (menuItem.NODEID === node.NODEID && menuItem.PARENTID === '-1') {
        return;
      } else if (menuItem.NODEID === node.NODEID) {
        const parentId = menuItem.PARENTID;
        const children = this.fullMenu.filter((child) => child.PARENTID === parentId);
        this.selectedItem[parentId]['status'] = !!children.some((child) => this.selectedItem[child.NODEID]['status']);
        return;
      }
    });

    // if (this.selectedItem.DATAMENUHOME === node.NODEID && !checked) {
    //   const menuItems = 0;
    //   this.fullMenu.forEach(menuItem => {
    //     Object.keys(this.selectedItem).forEach(key => {
    //       if (menuItem.NODEID === key) {
    //         if (this.selectedItem[key].status === true && this.selectedItem[key].children.length === 0) {
    //           this.selectedItem.DATAMENUHOME = key;
    //           return;
    //         }
    //       }
    //     });
    //   });
    // } else {
    //   if (this.selectedItem.DATAMENUHOME !== '') {
    //     if (!this.selectedItem[this.selectedItem.DATAMENUHOME].status) {
    //       this.fullMenu.forEach(menuItem => {
    //         Object.keys(this.selectedItem).forEach(key => {
    //           if (menuItem.NODEID === key) {
    //             if (this.selectedItem[key].status === true && this.selectedItem[key].parentID !== '-1') {
    //               this.selectedItem.DATAMENUHOME = key;
    //             }
    //           }
    //         });
    //       });
    //     }
    //   } else {
    //     this.fullMenu.forEach(menuItem => {
    //       Object.keys(this.selectedItem).forEach(key => {
    //         if (menuItem.NODEID === key) {
    //           if (this.selectedItem[key].status === true && this.selectedItem[key].parentID !== '-1') {
    //             this.selectedItem.DATAMENUHOME = key;
    //           }
    //         }
    //       });
    //     });
    //   }
    // }
  }

  changeNewInput(event) {
    this.selectedItem.PROFILEGROUPID = event.target.value;
  }

  invalidForm() {
    let falseCount = 0;
    let emptyValue = 0;
    if (this.selectedItem['PROFILEGROUPID'] === '') {
      emptyValue += 1;
    }
    this.profiles.forEach(profile => {
      Object.keys(this.selectedItem).forEach(key => {
        if (profile.id === key && this.selectedItem[key] === false) {
          falseCount += 1;
        }
      });
    });

    return falseCount === Object.keys(this.profiles).length || emptyValue !== 0;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  _transformer = (node: any, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.TEXT,
      level: level,
      ALLOWED_PROFILES: node.ALLOWED_PROFILES,
      ENABLED: node.ENABLED,
      ICON: node.ICON,
      NODEID: node.NODEID,
      ORDINAL: node.ORDINAL,
      PARENTID: node.PARENTID,
      TEXT: node.TEXT,
      URL: node.URL
    };
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

  confirmChange() {
    const arrayData = [];
    arrayData.push(this.selectedItem);
    const dialogRef = this.dialog.open(AlterDialog, {
      width: MODAL_SIZE.width,
      height: MODAL_SIZE.height,
      disableClose: true,
      data: {message: 'security.roles.confirm-question', date: undefined}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Y') {
        this.loading = true;
        const requestData = this.createRequest(arrayData);
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

}
