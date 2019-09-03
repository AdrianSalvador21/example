import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {BaseComponent} from '../../../../shared/components/base/base.component';

@Component({
  selector: 'two-collection-general-data',
  templateUrl: './collection-general-data.component.html',
  styleUrls: ['./collection-general-data.component.scss']
})
export class CollectionGeneralDataComponent extends BaseComponent implements OnInit {

  filterForm = this.fb.group({
    socialReason: [''],
    address: [''],
    rfc: [''],
    email: [''],
    phone: [''],
    name: ['']
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
