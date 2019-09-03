import {Component, Input, OnInit} from '@angular/core';
import {MatStepper} from '@angular/material';
import {Subscription} from 'rxjs';
import {TimerObservable} from 'rxjs-compat/observable/TimerObservable';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../../../../configs/app.config';
import {currentDateWithTime} from '../../../../shared/helpers';

@Component({
  selector: 'two-download-pld',
  templateUrl: './download-pld.component.html',
  styleUrls: ['./download-pld.component.scss']
})
export class DownloadPldComponent implements OnInit {

  time = 0;
  totalTime = 0;
  status;
  beneficiary;
  currentDate;
  suscription: Subscription;
  description = '';

  @Input() stepper: MatStepper;

  constructor(private translateService: TranslateService) {
  }

  @Input()
  set beneficiaryDataInput(value) {
    this.beneficiary = value;

    if (this.beneficiary.internationalBeneficiary) {
      this.description = this.translateService.instant('pld.downloadDetail.descriptionOptions.international');
    } else {
      this.description = this.translateService.instant('pld.downloadDetail.descriptionOptions.national');
    }
  }

  ngOnInit() {
    this.currentDate = currentDateWithTime().format(AppConfig.dateAndTimeFormat);
    this.status = this.translateService.instant('pld.downloadDetail.statusOptions.processing');
    let timer = TimerObservable.create(0, 1000);
    this.suscription = timer.subscribe(t => {
      this.time = t;
    });
  }

  return() {
    this.stepper.selectedIndex = 0;
  }

  cancel() {
    this.time = 0;
    this.suscription.unsubscribe();
    this.stepper.selectedIndex = 0;
  }

}
