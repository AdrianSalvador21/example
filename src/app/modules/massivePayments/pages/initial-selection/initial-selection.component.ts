import {Component, Input, OnInit} from '@angular/core';
import {MatStepper} from '@angular/material';

@Component({
  selector: 'two-initial-selection',
  templateUrl: './initial-selection.component.html',
  styleUrls: ['./initial-selection.component.scss']
})
export class InitialSelectionComponent implements OnInit {

  @Input()
  stepper: MatStepper;

  constructor() {
  }

  ngOnInit() {
  }

}
