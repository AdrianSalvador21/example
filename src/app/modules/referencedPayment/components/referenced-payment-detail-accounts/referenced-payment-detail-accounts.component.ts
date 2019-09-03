import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'two-referenced-payment-detail-accounts',
  templateUrl: './referenced-payment-detail-accounts.component.html',
  styleUrls: ['./referenced-payment-detail-accounts.component.scss']
})
export class ReferencedPaymentDetailAccountsComponent implements OnInit {
  @Input() listData;
  @Input() errorAccounts = [];
  @Input() onModify: boolean;
  @Input() onAuth: boolean;

  constructor() { }

  ngOnInit() {
  }

}
