import {Component, Input, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../../shared/components/base/base.component';

@Component({
  selector: 'two-issue-detail-section',
  templateUrl: './issue-detail-section.component.html',
  styleUrls: ['./issue-detail-section.component.scss']
})
export class IssueDetailSectionComponent extends BaseComponent implements OnInit {

  items: any = [
    1, 2, 3, 4
  ];

  @Input('rows') rows;

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
