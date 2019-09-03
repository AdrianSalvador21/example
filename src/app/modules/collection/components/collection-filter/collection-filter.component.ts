import { Component, OnInit } from '@angular/core';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'two-collection-filter',
  templateUrl: './collection-filter.component.html',
  styleUrls: ['./collection-filter.component.scss']
})
export class CollectionFilterComponent extends BaseComponent implements OnInit {

  filterForm = this.fb.group({
    client: ['', [Validators.pattern(this.regexAlphaNumeric), Validators.maxLength(9), Validators.minLength(9)]]
  });

  get f() {
    return this.filterForm.controls;
  }

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
  }

}
