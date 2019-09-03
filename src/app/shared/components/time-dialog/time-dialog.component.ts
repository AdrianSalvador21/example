import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {BaseComponent} from '../base/base.component';
import {AppConfig} from '../../../configs/app.config';

export interface TimeData {
  timeout: number;
}

@Component({
  selector: 'two-time-dialog',
  templateUrl: './time-dialog.component.html',
  styleUrls: ['./time-dialog.component.scss']
})
export class TimeDialogComponent extends BaseComponent implements OnInit {

  time: number;

  constructor(
    public dialogRef: MatDialogRef<TimeData>,
    @Inject(MAT_DIALOG_DATA) public data: TimeData
  ) {
    super();
    this.time = AppConfig.timeBeforeClose;
    this.countDown(AppConfig.timeBeforeClose);
  }

  ngOnInit() {
  }

  countDown (time: number) {
    if (this.time !== 0) {
      setTimeout( () => {
        this.time = time;
        this.countDown(time - 1);
      }, 1000);
    } else {
      this.dialogRef.close('N');
      return;
    }
  }

  close(action: string) {
    this.dialogRef.close(action);
  }

}
