import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatStepper} from '@angular/material';
import {AuthenticationService} from '../../../../core/services';

@Component({
  selector: 'two-menu-update',
  templateUrl: './menu-update.component.html',
  styleUrls: ['./menu-update.component.scss']
})
export class MenuUpdateComponent implements OnInit {
  @Input() stepper: MatStepper;
  @Output() returnOutput = new EventEmitter();
  fullMenu: any;
  loading = false;

  constructor(public authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.loading = true;
    this.authenticationService.getFullMenu().subscribe(fullMenu => {
      this.loading = false;
      this.fullMenu = fullMenu.data[0];
    });
  }

  reset() {
    this.returnOutput.emit();
  }
}
