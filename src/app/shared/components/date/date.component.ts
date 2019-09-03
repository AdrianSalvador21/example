import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../base/base.component';

@Component({
  selector: 'two-date-pipe',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent extends BaseComponent implements OnInit {

  today: number = Date.now();

  constructor() {
    super();
  }

  ngOnInit() {
  }

}


