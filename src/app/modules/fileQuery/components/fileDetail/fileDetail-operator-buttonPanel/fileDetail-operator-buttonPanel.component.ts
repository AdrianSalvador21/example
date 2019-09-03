import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Location} from '@angular/common';
import {MatStepper} from '@angular/material';
import {BaseComponent} from '../../../../../shared/components/base/base.component';
import {scrollToTop} from '../../../../../shared/helpers';
import {AppConfig} from '../../../../../configs/app.config';

@Component({
  selector: 'two-file-detail-operator-button-panel',
  templateUrl: './fileDetail-operator-buttonPanel.component.html',
  styleUrls: ['./fileDetail-operator-buttonPanel.component.scss']
})

export class FileDetailOperatorButtonPanelComponent extends BaseComponent implements OnInit{
  @Input()
  stepper: MatStepper;

  @Input()
  allowContinue: boolean;
  @Input()
  incomplete: boolean;

  @Output() onContinueClick = new EventEmitter();
  @Output() onFinalizeClick = new EventEmitter();
  @Output() onBackClick = new EventEmitter();

  onlyConsult = true;

  constructor(private _location: Location) {
    super();
  }

  ngOnInit(): void {
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    let roles = (<string>sessionData.role).split(',');
    roles.forEach((rol) => {
      if (rol !== 'CONSULTIVE') {
        this.onlyConsult = false;
      }
    });
  }

  goBack() {
    this.stepper.previous();
    scrollToTop();
    this.onBackClick.emit();
  }

  viewDetail() {
    this.onContinueClick.emit();
    this.stepper.next();
    scrollToTop();
  }

  finalize() {
    this.onFinalizeClick.emit();
  }

}
