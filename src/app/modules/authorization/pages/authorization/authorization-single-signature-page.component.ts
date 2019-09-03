import {Component} from '@angular/core';
import {fadeInOut} from '../../../../shared/helpers';
import {AuthorizationPageComponent} from './authorization-page.component';
import {AuthorizationService} from '../../../../core/services/authorization.service';
import {BeneficiaryService, MassivePaymentsService} from '../../../../core/services';
import {MatDialog} from '@angular/material';

@Component({
  templateUrl: './authorization-page.component.html',
  styleUrls: ['./authorization-page.component.scss'],
  animations: [fadeInOut]
})

export class AuthorizationSingleSignaturePageComponent extends AuthorizationPageComponent {
  cantSignatures = '1';

  constructor(authorizationService: AuthorizationService,
              beneficiaryService: BeneficiaryService,
              massivePaymentService: MassivePaymentsService,
              dialog: MatDialog) {
    super(authorizationService, beneficiaryService, massivePaymentService, dialog);
  }
}
