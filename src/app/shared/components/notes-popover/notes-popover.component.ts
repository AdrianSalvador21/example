import {Component} from '@angular/core';
import {BaseComponent} from '../base/base.component';

@Component({
  selector: 'two-notes-popover',
  templateUrl: './notes-popover.component.html',
  styleUrls: ['./notes-popover.component.scss']
})
export class NotesPopoverComponent extends BaseComponent {
  note: string;

  constructor() {
    super();
  }
}

