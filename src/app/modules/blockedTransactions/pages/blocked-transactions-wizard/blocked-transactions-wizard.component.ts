import {Component, OnInit, ViewChild} from '@angular/core';
import {BlockedTransactionsComponent} from '../blocked-transactions/blocked-transactions.component';

@Component({
  selector: 'two-blocked-transactions-wizard',
  templateUrl: './blocked-transactions-wizard.component.html',
  styleUrls: ['./blocked-transactions-wizard.component.scss']
})
export class BlockedTransactionsWizardComponent implements OnInit {
  @ViewChild('principal') principal: BlockedTransactionsComponent;

  constructor() {
  }

  ngOnInit() {
  }

  finalize() {
    this.principal.finalizeEvent();
  }

}
