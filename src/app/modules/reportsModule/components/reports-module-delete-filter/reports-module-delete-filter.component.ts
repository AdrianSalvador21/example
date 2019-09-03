import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {AlterDialog} from '../../../../shared/components/alter-dialog/alter-dialog.component';
import {currentDate, MODAL_SIZE} from '../../../../shared/helpers';
import {formatDate} from '@angular/common';

@Component({
  selector: 'two-reports-module-delete-filter',
  templateUrl: './reports-module-delete-filter.component.html',
  styleUrls: ['./reports-module-delete-filter.component.scss']
})
export class ReportsModuleDeleteFilterComponent extends BaseComponent implements OnInit {

  @Output() cleanEmitter = new EventEmitter();
  @Output() formDataEmitter = new EventEmitter();

  filterForm = this.fb.group({
    date: [currentDate(), Validators.required],
    report: ['AU']
  });

  enabledButton = true;
  invalidValue = false;

  invalid = false;
  showClean = true;
  formToSubmit = {
    service: '',
    documentType: '',
    documentNumber: '',
    status: '',
    name: ''
  };
  reports = ['AU'];
  orderByTypes = [];

  constructor(private fb: FormBuilder, public dialog: MatDialog) {
    super();
  }

  ngOnInit() {
  }

  onSubmit(value) {
    const dateToShow = formatDate(value.date, 'dd/MM/yyyy', 'en-US');
    const dialogRef = this.dialog.open(AlterDialog, {
      width: MODAL_SIZE.width,
      height: MODAL_SIZE.height,
      disableClose: true,
      data: {message: 'reportsModule.deleteMessage', date: dateToShow}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Y') {
        // Eliminar aqui
      } else {
        return;
      }
    });
  }

}
