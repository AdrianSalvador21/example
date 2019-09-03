import {Component, OnInit, ViewChild} from '@angular/core';
import {fadeInOut} from '../../../../shared/helpers/utils.helper';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {BeneficiariesEditionPageComponent} from '../beneficiaries-edition';

@Component({
  templateUrl: './beneficiaries-wizard.component.html',
  styleUrls: ['./beneficiaries-wizard.component.scss'],
  animations: [fadeInOut]
})
export class BeneficiariesWizardComponent extends BaseComponent implements OnInit {
  @ViewChild('edition') edition: BeneficiariesEditionPageComponent;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  returnConfirm() {
    this.edition.cleanForm();
  }

}
