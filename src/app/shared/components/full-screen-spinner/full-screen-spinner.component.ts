import {Component, OnInit} from '@angular/core';
import {fadeInOut} from '../../helpers';
import {BaseComponent} from '../base/base.component';

@Component({
  selector: 'two-full-screen-spinner',
  templateUrl: './full-screen-spinner.component.html',
  styleUrls: ['./full-screen-spinner.component.scss'],
  animations: [fadeInOut]
})
export class FullScreenSpinnerComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
