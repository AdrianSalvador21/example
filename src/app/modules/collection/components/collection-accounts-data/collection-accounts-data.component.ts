import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'two-collection-accounts-data',
  templateUrl: './collection-accounts-data.component.html',
  styleUrls: ['./collection-accounts-data.component.scss']
})
export class CollectionAccountsDataComponent implements OnInit {

  filterForm = this.fb.group({
    currencyType: [''],
    centeringAccount: [''],
    accountCollection: [''],
    accountRefund: ['']
  });

  get f() {
    return this.filterForm.controls;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}
