import {Component, Input} from '@angular/core';
import {BaseComponent} from '../../../../shared/components/base/base.component';

@Component({
  selector: 'two-beneficiary-confirm-section',
  templateUrl: './beneficiary-confirm-section.component.html',
  styleUrls: ['./beneficiary-confirm-section.component.scss']
})
export class BeneficiaryConfirmSectionComponent extends BaseComponent {

  @Input('rows') rows;

  constructor() {
    super();
  }
}
