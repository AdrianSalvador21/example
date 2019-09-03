import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {fadeInOut} from '../../../../shared/helpers';
import {FormBuilder} from '@angular/forms';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {Profile} from '../../../../shared/models';
import {UserInfo} from '../roles-update-filter/roles-update-filter.component';


@Component({
  selector: 'two-security-profile-details',
  templateUrl: './profiles-details.component.html',
  styleUrls: ['./profiles-details.component.scss'],
  animations: [fadeInOut]
})

export class ProfilesDetailsComponent extends BaseComponent implements OnInit {
  rolesList: Profile[] = [];
  initialRoles: Profile[] = [];
  loading: boolean;
  error;
  @Output() validState = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder) {
    super();
  }

  private _user: UserInfo;

  get user(): UserInfo {
    return this._user;
  }

  @Input()
  set user(user: UserInfo) {
    this._user = user;
    this.initialRoles = [];
    if (!!this._user) {
      this._user.roles.forEach((rol) => {
        this.initialRoles.push(rol);
      });
    }

  }

  ngOnInit() {
    Object.keys(Profile).forEach((key) => {
      this.rolesList.push(Profile[key]);
    });
    for (let i = 0; i < this.rolesList.length; i++) {
      for (let j = 0; j < this.user.roles.length; j++) {
        if (this.rolesList[i] === this.user.roles[j]) {
          this.rolesList.splice(i, 1);
        }
      }
    }
  }


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.validState.emit(JSON.stringify(this._user.roles) !== JSON.stringify(this.initialRoles));
  }
}
