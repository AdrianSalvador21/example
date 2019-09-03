import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../base/base.component';

@Component({
  selector: 'two-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
