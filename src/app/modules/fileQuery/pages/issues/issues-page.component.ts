import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {currentDate, fadeInOut, MODAL_SIZE} from '../../../../shared/helpers/utils.helper';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {MatDialog, MatStepper} from '@angular/material';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';
import {IssuesService} from '../../../../core/services';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {IssuesFilterComponent} from '../../components/issues/issues-filter';

@Component({
  selector: 'two-issues-page',
  templateUrl: './issues-page.component.html',
  styleUrls: ['./issues-page.component.scss'],
  animations: [fadeInOut]
})

export class IssuesPageComponent extends BaseComponent implements OnInit {
  @ViewChild('filter') filter: IssuesFilterComponent;
  @Input()
  stepper: MatStepper;
  pageIndex = 1;

  noFoundMessage = 'errors.no-found';
  showSearch = false;
  issuesDataResponse: any[] = [];
  loading = false;

  formDataFilter;

  initialForm = {
    cve_rastreo: '',
    dateFrom: currentDate(),
    dateTo: currentDate(),
    reference: '',
  };

  constructor(public dialog: MatDialog, public issuesService: IssuesService) {
    super();
  }

  ngOnInit(): void {
    this.getRows(this.initialForm, this.pageIndex, false, true);
  }

  getRows(formData, pageIndex, showDialog: boolean, refresh: boolean) {
    if (refresh) {
      this.showSearch = false;
    }
    this.formDataFilter = formData;
    this.loading = true;
    this.issuesService.getIssues(formData, pageIndex).subscribe(response => {
      this.loading = false;
      if (response !== undefined) {
        if (response == 'error') {
          const dialogRef = this.dialog.open(ErrorDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {error: 'errors.genericError'}
          });

          return;
        }
        this.issuesDataResponse = response;

        if (response.length === 0) {
          if (showDialog) {
            this.showSearch = false;
            const dialogRef = this.dialog.open(MessageDialog, {
              width: MODAL_SIZE.width,
              height: MODAL_SIZE.height,
              disableClose: true,
              data: {message: this.noFoundMessage}
            });
          }
          return;
        } else {
          this.filter.showClean = true;
        }
        this.showSearch = true;
      }
    }, error => {
      this.loading = false;
      if (showDialog) {
        const dialogRef = this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: 'errors.genericError'}
        });
      }
    });
  }

  getRowsEmitter(pageIndex) {
    this.getRows(this.formDataFilter, pageIndex, true, false);
  }

  cleanSearch(clean: boolean) {
    this.showSearch = clean;
  }
}
