import {Component} from '@angular/core';
import {BaseComponent} from '../../components/base/base.component';

@Component({
  selector: 'two-error404-page',
  templateUrl: './error404-page.component.html',
  styleUrls: ['./error404-page.component.scss']
})

export class Error404PageComponent extends BaseComponent {
  constructor() {
    super();
  }
}
