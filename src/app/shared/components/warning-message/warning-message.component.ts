import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'two-warning-message',
  templateUrl: './warning-message.component.html',
  styleUrls: ['./warning-message.component.scss']
})
export class WarningMessageComponent implements OnInit {
  @Input() message;

  constructor() { }

  ngOnInit() {
  }

}
