import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatStepper} from '@angular/material';
import {RolesUpdateGridComponent} from '../roles-update-grid/roles-update-grid.component';

@Component({
  selector: '' +
    'two-roles-update',
  templateUrl: './roles-update.component.html',
  styleUrls: ['./roles-update.component.scss']
})
export class RolesUpdateComponent implements OnInit {
  @Input() stepper: MatStepper;
  @ViewChild('rolesGrid') rolesGrid: RolesUpdateGridComponent;

  constructor() { }

  ngOnInit() {
  }

  formSubmit(filterData) {
    this.rolesGrid.filterData(filterData);
  }

  reset() {
    this.rolesGrid.updateData();
  }

  clean() {
    this.rolesGrid.restoreData();
  }

}
