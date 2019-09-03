import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatStepper} from '@angular/material';
import {scrollToTop} from '../../../../shared/helpers';
import {Router} from '@angular/router';
import {AppConfig} from '../../../../configs/app.config';

@Component({
  selector: 'two-referenced-payment-select',
  templateUrl: './referenced-payment-select.component.html',
  styleUrls: ['./referenced-payment-select.component.scss']
})
export class ReferencedPaymentSelectComponent implements OnInit {
  listData;
  pendingData;
  enabledButton = false;
  valid = 0;
  selectedList = [];
  selectedItem;
  @Output() cleanSearch = new EventEmitter();
  @Output() noData = new EventEmitter();
  @Input() stepper: MatStepper;
  @Input() onHighOperationInput: any;
  @Output() cleanEmitter = new EventEmitter();

  @Input()
  set dataList(value) {
    this.selectedList = [];
    this.listData = value.filter((account) => {
        return !account['PENDING'];
      }
    );
    this.pendingData = value.filter((account) => {
        return !!account['PENDING'];
      }
    );
    if (!this.listData || this.listData.length === 0) {
      this.noData.emit();
      this.cleanSearch.emit(this.onHighOperationInput);
    }
  }


  constructor(public router: Router) {
  }

  ngOnInit() {
  }

  selectAllElements(data) {
    if (data.checked) {
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i]['checked'] = true;
        this.enabledButton = true;
      }
    } else {
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i]['checked'] = false;
        this.enabledButton = false;
      }
    }
  }

  validate(index, value) {
    if (this.onHighOperationInput) {
      this.valid = 0;
      this.listData[index]['checked'] = value;
      for (let i = 0; i < this.listData.length; i++) {
        if (this.listData[i]['checked'] == true) {
          this.valid++;
        }
      }
      this.enabledButton = this.valid !== 0;
    } else {
      this.selectedItem = value;
      this.enabledButton = !!this.selectedItem;
    }
  }

  continue() {
    this.selectedList = [];

    if (this.onHighOperationInput) {
      for (let i = 0; i < this.listData.length; i++) {
        if (this.listData[i]['checked'] == true) {
          this.selectedList.push(this.listData[i]);
        }
      }
    } else {
      this.selectedList.push(this.selectedItem);
    }
    this.stepper['accountsData'] = this.selectedList;
    this.stepper['onHigh'] = this.onHighOperationInput;
    this.stepper.next();
    scrollToTop();
  }

  returnSelect() {
    this.cleanEmitter.emit();
    this.router.navigate(['/' + AppConfig.routes.operationsModule.root]);
  }

}
