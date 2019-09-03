import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'two-reports-module',
  templateUrl: './reports-module.component.html',
  styleUrls: ['./reports-module.component.scss']
})
export class ReportsModuleComponent implements OnInit {

  showResult: boolean;
  loading: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  showResultEvent(show) {
    this.showResult = show;
  }

}
