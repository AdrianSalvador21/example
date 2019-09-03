import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'two-referenced-payment-detail-section',
  templateUrl: './referenced-payment-detail-section.component.html',
  styleUrls: ['./referenced-payment-detail-section.component.scss']
})
export class ReferencedPaymentDetailSectionComponent implements OnInit {

  @Input() data;

  constructor() { }

  ngOnInit() {
  }

}
