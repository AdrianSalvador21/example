import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {MatStepper} from '@angular/material';
import {BaseComponent} from '../../../../../shared/components/base/base.component';
import {scrollToTop} from '../../../../../shared/helpers';

@Component({
  selector: 'two-file-query-operator-button-panel',
  templateUrl: './fileQuery-operator-buttonPanel.component.html',
  styleUrls: ['./fileQuery-operator-buttonPanel.component.scss']
})

export class FileQueryOperatorButtonPanelComponent extends BaseComponent {
  @Input()
  stepper: MatStepper;

  @Input()
  allowContinue: boolean;

  fileSelected;
  @Output()
  continueClick = new EventEmitter();

  constructor(public router: Router) {
    super();
  }

  @Input()
  set fileSelectedInput(value) {
    if (this.fileSelected === value)
      return;
    this.fileSelected = value;
  }

  viewDetail() {
    this.continueClick.emit();
    this.stepper['fileSelected'] = this.fileSelected;
    this.stepper.next();
    scrollToTop();
  }
}
