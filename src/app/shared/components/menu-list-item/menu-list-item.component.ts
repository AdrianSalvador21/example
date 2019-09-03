import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {Params, Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Profile} from '../../models/role.enum';
import {BaseComponent} from '../base/base.component';


// export interface NavItem {
//   displayName: string;
//   disabled?: boolean;
//   iconName?: string;
//   route?: string;
//   children?: NavItem[];
//   roles: Role[];
//   queryParams?: Params;
// }

export interface NavItem {
  ENABLED: string;
  ICON: string;
  NODEID: string;
  ORDINAL: string;
  PARENTID: string;
  TEXT: string;
  URL: string;
  children?: NavItem[];
  roles: Profile[];
  queryParams?: Params;
}

@Component({
  selector: 'two-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class MenuListItemComponent extends BaseComponent {
  static expandedItem: NavItem;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem;
  @Input() showCompleteMenu: boolean;
  @Input() isChild: boolean;
  @Output() closeMenu = new EventEmitter();
  loading: boolean;


  toolOptions = {
    'placement': 'right',
    'show-delay': 200,
    'theme': 'light',
    'tooltip-class': 'clase'
  };

  constructor(public router: Router) {
    super();
  }

  get expanded() {
    return this.item === MenuListItemComponent.expandedItem;
  }

  onItemSelected(item: NavItem) {
    if (!item.children || item.children.length === 0) {
      this.loading = true;
      if (item.queryParams) {
        this.router.navigate([item.URL], {queryParams: item.queryParams}).then(() => {
          this.loading = false;
        });
      } else {
        this.router.navigate([item.URL]).then(() => {
          this.loading = false;
        });
      }
      MenuListItemComponent.expandedItem = undefined;
      this.closeMenu.emit();
    }
    if (!!item.children && !!item.children.length) {
      if (this.expanded) {
        MenuListItemComponent.expandedItem = undefined;
      } else {
        MenuListItemComponent.expandedItem = this.item;
      }
    }
  }

  isActive(item: NavItem) {
    let strQueryParams = '';
    if (!!item.queryParams) {
      const keys = Object.keys(item.queryParams);
      strQueryParams += '?';
      keys.forEach((k) => {
        strQueryParams += k + '=' + item.queryParams[k];
      });
    }
    if (this.router.isActive(item.URL + strQueryParams, true)) {
      return true;
    } else if (!item.children) {
      return false;
    } else {
      for (let i = 0; i < item.children.length; i++) {
        if (this.isActive(item.children[i])) {
          return true;
        }
      }
      return false;
    }
  }
}
