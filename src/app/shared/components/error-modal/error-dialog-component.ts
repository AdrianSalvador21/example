import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {BaseComponent} from '../base/base.component';

export interface ErrorData {
  error: any;
  invalidSession?: any;
}

@Component({
  selector: 'error-dialog',
  templateUrl: 'error-dialog.component.html',
  styleUrls: ['error-dialog.component.scss']
})

export class ErrorDialog extends BaseComponent {

  constructor(
    public dialogRef: MatDialogRef<ErrorData>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorData
  ) {
    super();
  }
}
