import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'two-collection-capture-instructions',
  templateUrl: './collection-capture-instructions.component.html',
  styleUrls: ['./collection-capture-instructions.component.scss']
})
export class CollectionCaptureInstructionsComponent implements OnInit {

  filterForm = this.fb.group({
    algorithm: [''],
    referenceMaxLength: [''],
    referenceMinLength: [''],
    conceptMaxLength: [''],
    conceptMinLength: ['']
  });

  get f() {
    return this.filterForm.controls;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}
