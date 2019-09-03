import {Component, EventEmitter, Input, Output} from '@angular/core';
import {fadeInOut} from '../../../../shared/helpers';
import {BaseComponent} from '../../../../shared/components/base/base.component';

@Component({
  selector: 'two-beneficiary-authorization-buttonPanel',
  templateUrl: './authorization-buttonPanel.component.html',
  styleUrls: ['./authorization-buttonPanel.component.scss'],
  animations: [fadeInOut]
})

export class AuthorizationButtonPanelComponent extends BaseComponent {
  @Output() showDetails = new EventEmitter();
  @Output() back = new EventEmitter();
  @Output() auth = new EventEmitter();
  @Output() denegate = new EventEmitter();
  @Output() beforeOrAfter = new EventEmitter();

  @Input() showBackButton: boolean;
  @Input() showDetailsButton: boolean;
  @Input() allowShowDetails: boolean;
  @Input() allowAuth: boolean;
  @Input() allowDenegate: boolean;

  beforeButtonText: string = 'Antes  ';
  afterButtonText: string = 'Después';

  constructor() {
    super();
  }

  OnDetailsClick() {
    this.showDetails.emit('pressed');
  }

  OnBackClick() {
    this.back.emit('pressed');
  }

  OnAuthClick() {
    this.auth.emit('pressed');
  }

  OnDenegateClick() {
    this.denegate.emit('pressed');
  }

  OnBeforeChanges() {
    this.beforeOrAfter.emit(false);
  }

  OnAfterChanges() {
    this.beforeOrAfter.emit(true);
  }
}
