import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {BaseComponent} from '../base/base.component';

export interface MessageData {
  message: any;
  folio?: any;
}

@Component({
  selector: 'message-dialog',
  templateUrl: 'message-dialog.component.html',
  styleUrls: ['message-dialog.component.scss']
})

export class MessageDialog extends BaseComponent {

  constructor(
    public dialogRef: MatDialogRef<MessageData>,
    @Inject(MAT_DIALOG_DATA) public data: MessageData
  ) {
    super();
  }
}
