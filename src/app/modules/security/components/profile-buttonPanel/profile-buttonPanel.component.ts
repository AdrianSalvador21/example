import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BaseComponent} from '../../../../shared/components/base/base.component';

@Component({
  selector: 'two-security-profile-button-panel',
  templateUrl: './profile-buttonPanel.component.html',
  styleUrls: ['./profile-buttonPanel.component.scss']
})

export class ProfileButtonPanelComponent extends BaseComponent {
  @Input()
  saveEnabled: boolean;

  @Output()
  saveChanges = new EventEmitter();

  constructor() {
    super();
  }

  save() {
    this.saveChanges.emit();
  }

}
