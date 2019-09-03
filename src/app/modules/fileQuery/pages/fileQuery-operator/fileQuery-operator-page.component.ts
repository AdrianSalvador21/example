import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {currentDate, fadeInOut, MODAL_SIZE} from '../../../../shared/helpers/utils.helper';
import {FileQueryOperatorListComponent} from '../../components/fileQuery/fileQuery-operator-list';
import {MatDialog, MatStepper} from '@angular/material';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {FileQueryService} from '../../../../core/services/fileQuery.service';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {FileQueryOperatorFilterComponent} from '../../components/fileQuery/fileQuery-operator-filter';
import {AppConfig} from '../../../../configs/app.config';

@Component({
  selector: 'two-fileQuery-operator',
  templateUrl: './fileQuery-operator-page.component.html',
  styleUrls: ['./fileQuery-operator-page.component.scss'],
  animations: [fadeInOut]
})

export class FileQueryOperatorPageComponent extends BaseComponent implements OnInit {
  error;
  loading: boolean = false;

  noFoundMessage: string = 'errors.no-found';
  showNoFoundMessage: boolean;

  showSearch: boolean = false;

  fileItemSelected: any;
  totalFiles: number;

  @Input()
  stepper: MatStepper;

  allowContinue: boolean;

  @Output()
  continueClick = new EventEmitter();

  initialForm = {
    accountCharge: '',
    dateFrom: currentDate(),
    dateTo: currentDate(),
    fileName: '',
    folio: '',
    status: ''
  };

  @ViewChild('list') list: FileQueryOperatorListComponent;
  @ViewChild('filter') filter: FileQueryOperatorFilterComponent;

  actuallyPage: number = 1;
  formData;
  fileQueryData: Array<any>;

  constructor(private fileQueryService: FileQueryService, public dialog: MatDialog) {
    super();
    this.getRows(true, this.initialForm, false, 1);
  }

  ngOnInit(): void {
    this.initialForm.dateFrom.format(AppConfig.dateFormat);
    this.initialForm.dateTo.format(AppConfig.dateFormat);
  }

  getRows(refresh: boolean, formData, showDialog, pageNumber?: number) {
    if (pageNumber) {
      this.assignActuallyPage(pageNumber);
    } else {
      this.assignActuallyPage();
    }
    if (refresh) {
      this.showSearch = false;
    }
    this.formData = formData;
    this.RefreshResults(false, showDialog);
  }

  RefreshResults(initial: boolean, showDialog) {
    if (initial) {
      this.filter.cleanReturn();
      this.getRows(true, this.initialForm, false, 1);
      return;
    }
    this.allowContinue = false;
    this.loading = true;
    this.fileQueryService.getFiles(this.formData, this.actuallyPage).subscribe(response => {
      this.loading = false;
      if (response !== undefined) {
        if (response == 'error') {
          this.dialog.open(ErrorDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {error: 'errors.genericError'}
          });
          return;
        }
        if (response.length !== 0) {

          this.fileQueryData = response;
          this.showSearch = true;
          this.totalFiles = parseInt(this.fileQueryService.totalFiles);
        } else {
          if (showDialog) {
            this.dialog.open(MessageDialog, {
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
        this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: 'errors.genericError'}
        });
      }
    });
  }

  assignActuallyPage(pageNumber?: number) {
    if (pageNumber) {
      this.actuallyPage = pageNumber;
    } else {
      this.actuallyPage = 1;
    }
  }

  getRowsPage(page) {
    this.getRows(false, this.formData, false, page);
  }

  onFileSelect(obj) {
    this.fileItemSelected = obj;
    this.allowContinue = true;
  }

  onContinueClick() {
    this.continueClick.emit();
  }

}
