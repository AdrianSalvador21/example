import {Component, OnInit, ViewChild} from '@angular/core';
import {RolesUpdateComponent} from '../../components/roles-update/roles-update.component';

@Component({
  selector: 'two-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  @ViewChild('rolesUpdate') rolesUpdate: RolesUpdateComponent;

  constructor() { }

  ngOnInit() {
  }

  reset() {
    this.rolesUpdate.reset();
  }

}
