import {Component, Input, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../shared/components/base/base.component';

@Component({
  selector: 'two-blocked-transaction-section',
  templateUrl: './blocked-transaction-seccion.component.html',
  styleUrls: ['./blocked-transaction-seccion.component.scss']
})
export class BlockedTransactionSeccionComponent extends BaseComponent implements OnInit {

  @Input('rows') rows;

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
