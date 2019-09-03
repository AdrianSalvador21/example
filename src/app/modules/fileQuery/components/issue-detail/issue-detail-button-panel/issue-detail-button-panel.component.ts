import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatStepper} from '@angular/material';
import {BaseComponent} from '../../../../../shared/components/base/base.component';
import {scrollToTop} from '../../../../../shared/helpers';
import {AppConfig} from '../../../../../configs/app.config';

@Component({
  selector: 'two-issue-detail-button-panel',
  templateUrl: './issue-detail-button-panel.component.html',
  styleUrls: ['./issue-detail-button-panel.component.scss']
})
export class IssueDetailButtonPanelComponent extends BaseComponent implements OnInit {

  @Input()
  stepper: MatStepper;

  @Input() onFileLineDetails: boolean;
  @Input() showIssuesButton: boolean;
  @Input() fileQueryWizard: boolean;
  @Input() showRegulaButtonsInput: boolean;
  @Input() onUnitQueryDetails: boolean;

  @Output() onReturnClick = new EventEmitter();
  @Output() onFinalizeClick = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() unitFinalizeEmitter = new EventEmitter();
  message = 'errors.authorization-required';
  onlyConsult = true;

  constructor(public dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    let roles = (<string>sessionData.role).split(',');
    roles.forEach((rol) => {
      if (rol !== 'CONSULTIVE') {
        this.onlyConsult = false;
      }
    });
  }

  return() {
    this.stepper.previous();
    scrollToTop();
  }

  finalize() {
    if (this.fileQueryWizard) {
      this.stepper.reset();
      scrollToTop();
      this.refresh.emit();
    } else {
      this.onFinalizeClick.emit();
    }
  }

  finalizeUnitQuery() {
    this.unitFinalizeEmitter.emit();
  }

}
