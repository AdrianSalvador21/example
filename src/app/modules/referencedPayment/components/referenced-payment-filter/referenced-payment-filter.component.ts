import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, NgForm, Validators} from '@angular/forms';
import {BaseComponent} from '../../../../shared/components/base/base.component';
import {MatDialog, MatStepper} from '@angular/material';
import {BeneficiaryService} from '../../../../core/services';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {MODAL_SIZE} from '../../../../shared/helpers';
import {MessageDialog} from '../../../../shared/components/message-dialog/message-dialog.component';

@Component({
  selector: 'two-referenced-payment-filter',
  templateUrl: './referenced-payment-filter.component.html',
  styleUrls: ['./referenced-payment-filter.component.scss']
})
export class ReferencedPaymentFilterComponent extends BaseComponent implements OnInit {
  @ViewChild('formDirective') private formDirective: NgForm;
  @Input() stepper: MatStepper;
  private _readonly: boolean;
  loading: boolean;
  disabledButton = false;
  @Input() selectedOption: any;
  showClean = false;

  @Input() set readonly(value: boolean) {
    this._readonly = value;
    if (value) {
      this.filterForm.controls.clientID.disable({onlySelf: true, emitEvent: false});
    } else {
      this.filterForm.controls.clientID.enable({onlySelf: true, emitEvent: false});
    }
  }

  get readonly(): boolean {
    return this._readonly;
  }

  @Output() operationTypeEmitter = new EventEmitter();
  @Output() formDataEmitter = new EventEmitter();
  @Output() cleanData = new EventEmitter();

  filterForm = this.fb.group({
    clientID: ['', [Validators.required, Validators.minLength(9)]],
    legalReference: ''
  });

  constructor(public fb: FormBuilder, private beneficiaryService: BeneficiaryService, public dialog: MatDialog) {
    super();
  }

  get f() {
    return this.filterForm.controls;
  }

  ngOnInit() {
    this.f.legalReference.disable({onlySelf: true, emitEvent: false});
    this.filterForm.controls.clientID.valueChanges.subscribe(() => {
      // if (!!this.filterForm.getRawValue().clientID && this.filterForm.getRawValue().clientID.length === 9) {
      //   this.disabledButton = false;
      //   this.getUserInfo();
      // }
    });
  }

  onSubmit(onHigh: boolean) {
    if (onHigh) {
      this.operationTypeEmitter.emit(true);
    } else {
      this.operationTypeEmitter.emit(false);
    }
    this.formDataEmitter.emit(this.filterForm.getRawValue());
  }

  getUserInfo() {
    const clientID = this.f.clientID.value;
    this.loading = true;
    this.beneficiaryService.getBeneficiaryDetail(clientID).subscribe((serviceResponse) => {
      this.loading = false;
      if (serviceResponse.errorCode === 0) {
        this.showClean = true;
        const ordenantResponse = JSON.parse(serviceResponse.data);
        if (ordenantResponse['NOMBRE'] !== '') {
          this.f.legalReference.setValue(ordenantResponse['NOMBRE']);
          this.stepper['clientID'] = clientID;
          this.stepper['ordenantName'] = ordenantResponse['NOMBRE'];

          console.log(this.selectedOption);
          if (this.selectedOption === 'register') {
            this.operationTypeEmitter.emit(true);
          } else if (this.selectedOption === 'deactivation') {
            this.operationTypeEmitter.emit(false);
          }
          this.formDataEmitter.emit(this.filterForm.getRawValue());
        } else {
          this.dialog.open(MessageDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {message: 'referencedPayment.noFoundClient'}
          });
          this.disabledButton = true;
        }
      }
    }, error => {
      this.loading = false;
      this.dialog.open(ErrorDialog, {
        width: MODAL_SIZE.width,
        height: MODAL_SIZE.height,
        disableClose: true,
        data: {error: 'errors.genericError'}
      });
    });
  }

  cleanForm() {
    this.filterForm.reset();
    this.formDirective.resetForm();
    this.filterForm.controls.clientID.setValue('');
    this.cleanData.emit(false);
    this.showClean = false;
  }

  noData() {
    this.readonly = false;
  }

  cleanName() {
    this.filterForm.controls.legalReference.setValue('');
  }
}
