import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatStepper} from '@angular/material';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {ClarificationService} from '../../../../core/services';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';
import {MODAL_SIZE} from '../../../../shared/helpers';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {ClarificationsFilterComponent} from '../../components/clarifications/clarifications-filter/clarifications-filter.component';

@Component({
  selector: 'two-clarifications',
  templateUrl: './clarifications.component.html',
  styleUrls: ['./clarifications.component.scss']
})
export class ClarificationsComponent extends BaseComponent implements OnInit {
  @ViewChild('unitFilter') unitFilter: ClarificationsFilterComponent;

  showSearch: boolean = false;
  showClean = false;
  unitQueriesData;
  loading = false;

  pageIndex = 1;
  formData;

  noFoundMessage = 'errors.no-found';

  @Input()
  stepper: MatStepper;

  constructor(public clarificationService: ClarificationService, public dialog: MatDialog) {
    super();
  }

  getUnitQueries(formData, pageIndex, showDialog) {
    this.formData = formData;
    this.loading = true;
    this.clarificationService.getUnitQueries(this.formData, pageIndex).subscribe(resData => {
      if (resData == 'error') {
        this.loading = false;
        this.showSearch = false;
        if (showDialog) {
          const dialogErroRef = this.dialog.open(ErrorDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {error: 'errors.genericError'}
          });
        }
        return;
      }
      if (resData !== undefined) {
        if (resData.length > 0) {
          this.unitQueriesData = resData;
          this.showSearch = true;
          this.loading = false;
          this.showClean = true;
        } else {
          this.showSearch = false;
          this.loading = false;
          if (showDialog) {
            const dialogRef = this.dialog.open(MessageDialog, {
              width: MODAL_SIZE.width,
              height: MODAL_SIZE.height,
              disableClose: true,
              data: {message: this.noFoundMessage}
            });
          }
        }
      }
    }, error => {
      this.loading = false;
      if (showDialog) {
        const dialogErroRef = this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: 'errors.genericError'}
        });
      }
    });
  }

  getUnitQueriesByIndex(pageIndex) {
    this.getUnitQueries(this.formData, pageIndex, false);
  }

  ngOnInit() {
    this.getUnitQueries(this.unitFilter.filterForm.value, 1, false);
  }

  refreshForm() {
    this.unitFilter.resetAll();
    this.getUnitQueries(this.unitFilter.filterForm.value, 1, false);
  }

}
