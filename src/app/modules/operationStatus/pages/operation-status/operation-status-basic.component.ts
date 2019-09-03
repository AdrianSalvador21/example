import {Component, OnInit} from '@angular/core';
import {OperationStatusComponent} from './operation-status.component';
import {AuthorizationService} from '../../../../core/services/authorization.service';
import {BeneficiaryService, OperationStatusService} from '../../../../core/services';
import {MatDialog} from '@angular/material';
import {AppConfig} from '../../../../configs/app.config';

@Component({
  selector: 'two-operation-status-basic',
  templateUrl: './operation-status-basic.component.html',
  styleUrls: ['./operation-status-basic.component.scss']
})
export class OperationStatusBasicComponent extends OperationStatusComponent implements OnInit {
  constructor(authorizationService: AuthorizationService,
              operationStatusService: OperationStatusService,
              beneficiaryService: BeneficiaryService,
              dialog: MatDialog) {
    super(authorizationService, operationStatusService, beneficiaryService, dialog);
  }

  ngOnInit() {
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    this.creatorUser = sessionData.username;
    super.ngOnInit();
  }
}
