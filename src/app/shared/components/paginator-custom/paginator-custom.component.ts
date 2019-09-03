import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {CanDisable, HasInitialized, MatPaginator, MatPaginatorIntl} from '@angular/material';

@Component({
  selector: 'two-paginator-custom',
  templateUrl: 'paginator-custom.component.html',
  styleUrls: ['paginator-custom.component.scss'],
  inputs: ['disabled'],
  host: {
    'class': 'two-paginator-custom',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TwoPaginatorCustomComponent extends MatPaginator implements OnInit, OnDestroy, CanDisable,
  HasInitialized {

  actuallyRange: number = 0;
  ranges: any = [];
  disabled: boolean;

  constructor(_intl: MatPaginatorIntl,
              _changeDetectorRef: ChangeDetectorRef) {
    super(_intl, _changeDetectorRef);
  }

  ngOnInit() {
    super.ngOnInit();
    this.getRanges();
  }

  _previousButtonsDisabled() {
    return this.disabled || !this.hasPreviousPage();
  }

  /** Checks whether the buttons for going forwards should be disabled. */
  _nextButtonsDisabled() {
    return this.disabled || !this.hasNextPage();
  }

  getRanges() {
    let rango = [];
    this.ranges = [];
    const pagesNumber = Math.ceil(this.length / this.pageSize);
    for (let i = 1; i <= pagesNumber; i++) {
      rango.push(i);
      if (rango.length === 5 || i === pagesNumber) {
        this.ranges.push(rango);
        rango = [];
      }
    }
  }

  getRange(pageNumber: number): number {
    for (let i = 0; i < this.ranges.length; i++) {
      for (let j = 0; j < this.ranges[i].length; j++) {
        if (pageNumber === this.ranges[i][j]) {
          return this.ranges[i];
        }
      }
    }
  }

  changePageInRange(page: number) {
    let previousPageIndex = this.pageIndex;
    this.pageIndex = page - 1;
    this.page.emit({
      previousPageIndex,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.length
    });
  }
}
