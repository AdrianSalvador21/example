import {Component, Input} from '@angular/core';
import {BaseComponent} from '../base/base.component';

@Component({
  selector: 'two-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent extends BaseComponent {
  @Input()
  breadcrumbList: string[];

  constructor() {
    super();
  }
}
