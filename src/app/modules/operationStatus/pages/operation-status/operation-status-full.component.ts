import {Component, OnInit, ViewChild} from '@angular/core';
import {OperationStatusComponent} from './operation-status.component';
import {AuthorizationService} from '../../../../core/services/authorization.service';
import {BeneficiaryService, OperationStatusService} from '../../../../core/services';
import {MatDialog} from '@angular/material';
import {currentDate} from '../../../../shared/helpers';
import {OperationStatusFilterComponent} from '../../components/operation-status-filter/operation-status-filter.component';
import {OperationStatusFullFilterComponent} from '../../components/operation-status-full-filter/operation-status-full-filter.component';

@Component({
  selector: 'two-operation-status-full',
  templateUrl: './operation-status-full.component.html',
  styleUrls: ['./operation-status-full.component.scss']
})
export class OperationStatusFullComponent extends OperationStatusComponent implements OnInit {
  constructor(authorizationService: AuthorizationService,
              operationStatusService: OperationStatusService,
              beneficiaryService: BeneficiaryService,
              dialog: MatDialog) {

    super(authorizationService, operationStatusService, beneficiaryService, dialog);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
