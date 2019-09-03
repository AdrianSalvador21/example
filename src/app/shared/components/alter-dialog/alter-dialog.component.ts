import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {BaseComponent} from '../base/base.component';

export interface MessageData {
  message: any;
  date: any;
}

@Component({
  selector: 'two-alter-dialog',
  templateUrl: 'alter-dialog.component.html',
  styleUrls: ['alter-dialog.component.scss']
})

export class AlterDialog extends BaseComponent {
  constructor(
    public dialogRef: MatDialogRef<MessageData>,
    @Inject(MAT_DIALOG_DATA) public data: MessageData
  ) {
    super();
  }

  close(action: string) {
    this.dialogRef.close(action);
  }
}
