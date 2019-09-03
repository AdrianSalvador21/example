import {Component, Inject} from '@angular/core';
import {BaseComponent} from '../base/base.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

export interface MessageData {
  message: any;
}

@Component({
  selector: 'two-decision-dialog',
  templateUrl: 'decision-dialog.component.html',
  styleUrls: ['decision-dialog.component.scss']
})

export class DecisionDialog extends BaseComponent {
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
