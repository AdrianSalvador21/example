import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {ClarificationsComponent} from '../clarifications/clarifications.component';

@Component({
  selector: 'app-clarifications-wizard',
  templateUrl: './clarifications-wizard.component.html',
  styleUrls: ['./clarifications-wizard.component.scss']
})
export class ClarificationsWizardComponent extends BaseComponent implements OnInit {
  @ViewChild('clarifications') clarifications: ClarificationsComponent;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  refreshUnitSearch() {
    this.clarifications.refreshForm();
  }

}
