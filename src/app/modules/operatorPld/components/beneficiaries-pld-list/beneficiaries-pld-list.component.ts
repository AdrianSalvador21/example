import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatStepper} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {TwoPaginatorCustomComponent} from '../../../../shared/components/paginator-custom/paginator-custom.component';
import {BeneficiaryService} from '../../../../core/services';
import {ErrorDialog} from '../../../../shared/components/error-modal/error-dialog-component';
import {MODAL_SIZE, scrollToTop} from '../../../../shared/helpers';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'two-beneficiaries-pld-list',
  templateUrl: './beneficiaries-pld-list.component.html',
  styleUrls: ['./beneficiaries-pld-list.component.scss']
})
export class BeneficiariesPldListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'contract', 'client', 'accountType', 'beneficiaryId', 'name', 'personType',
    'status', 'modifyDate', 'user', 'date'];
  selection = new SelectionModel<any>(true, []);
  @ViewChild(TwoPaginatorCustomComponent) paginator: TwoPaginatorCustomComponent;
  itemSelected: any;
  pageData: any;
  loading = false;
  beneficiary;
  @Input() stepper: MatStepper;
  @Output() itemSelectedEmitter = new EventEmitter();
  @Output() paginatorChange = new EventEmitter();
  @Output() selectionChange = new EventEmitter();
  @Output() buttonClick = new EventEmitter();
  listData;
  listTotal;

  constructor(public beneficiaryService: BeneficiaryService, public dialog: MatDialog) {
  }

  @Input()
  set listDataInput(value) {
    this.listData = value;
    this.listTotal = parseInt(this.listData[0].total);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.paginator !== undefined) {
      this.paginator.page
        .pipe(
          tap(() => {
            this.paginatorChange.emit([(this.paginator.pageIndex + 1), this.paginator.pageSize]);
          })
        )
        .subscribe();
    }

  }

  assignRegister(item) {
    this.itemSelected = item;
    this.itemSelectedEmitter.emit(item);
  }


  modification(directDetail: boolean, download: boolean) {
    this.loading = true;

    this.beneficiaryService.getBeneficiary(this.itemSelected.clientId, '', this.itemSelected.benefAccountNumber, this.itemSelected.status, '').subscribe(response => {
      if (response !== undefined) {
        if (!!response['errorCode']) {
          const dialogRef = this.dialog.open(ErrorDialog, {
            width: MODAL_SIZE.width,
            height: MODAL_SIZE.height,
            disableClose: true,
            data: {error: 'errors.genericError'}
          });
          return;
        }
        this.beneficiary = response;

        if (this.beneficiary.internationalBeneficiary) {
          this.beneficiaryService.getBeneficiaryDetail(this.beneficiary.clientNumber).subscribe(serviceResponse => {
            let ordenantResponse = JSON.parse(serviceResponse.data);
            this.beneficiary.ordenantData.address = `${ordenantResponse['CALLE']} ${ordenantResponse['NRO_PUERTA']}`;
            if (ordenantResponse.APARTAMENTO !== '') {
              this.beneficiary.ordenantData.address += ', ';
              this.beneficiary.ordenantData.address += ordenantResponse['APARTAMENTO'];
            }
            if (ordenantResponse.BARRIO !== '') {
              this.beneficiary.ordenantData.address += ', ';
              this.beneficiary.ordenantData.address += ordenantResponse['BARRIO'];
            }
            if (ordenantResponse.CODIGO_POSTAL !== '') {
              this.beneficiary.ordenantData.address += ', ';
              this.beneficiary.ordenantData.address += `C.P. ${ordenantResponse['CODIGO_POSTAL']}`;
            }
            this.beneficiary.ordenantData.city = `${ordenantResponse['LOCALIDAD']}, ${ordenantResponse['CIUDAD']}`;
            this.beneficiary.ordenantData.country = `${ordenantResponse['PAIS']}`;
            this.beneficiary.ordenantData.name = `${ordenantResponse['NOMBRE']}`;
            this.loading = false;

            this.stepper['beneficiaryData'] = this.beneficiary;
            if (directDetail) {
              this.buttonClick.emit(0);
              if (response.benefStatus == 'ACTIVE') {
                this.stepper['beneficiaryData']['operationType'] = 'A';
              } else if (response.benefStatus == 'INACTIVE_PLD') {
                this.stepper['beneficiaryData']['operationType'] = 'I';
              } else {
                this.stepper['beneficiaryData']['operationType'] = 'R';
              }
              this.loading = false;
              this.stepper.selectedIndex = 1;
              this.stepper.selectedIndex = 2;
              this.stepper.selectedIndex = 3;
              scrollToTop();
            } else if (download) {
              this.loading = false;
              this.stepper.selectedIndex = 1;
            } else {
              this.loading = false;
              this.buttonClick.emit(1);
              this.stepper.selectedIndex = 1;
              this.stepper.selectedIndex = 2;
              scrollToTop();
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

        } else {
          this.beneficiary['ordenantData'] = {
            address: '',
            city: '',
            country: '',
            name: ''
          };
          this.beneficiaryService.getBeneficiaryDetail(this.beneficiary.clientNumber).subscribe(response => {
            let ordenantResponse = JSON.parse(response.data);
            this.beneficiary.ordenantData.address = `${ordenantResponse['CALLE']} ${ordenantResponse['NRO_PUERTA']}`;
            if (ordenantResponse.APARTAMENTO !== '') {
              this.beneficiary.ordenantData.address += ', ';
              this.beneficiary.ordenantData.address += ordenantResponse['APARTAMENTO'];
            }
            if (ordenantResponse.BARRIO !== '') {
              this.beneficiary.ordenantData.address += ', ';
              this.beneficiary.ordenantData.address += ordenantResponse['BARRIO'];
            }
            if (ordenantResponse.CODIGO_POSTAL !== '') {
              this.beneficiary.ordenantData.address += ', ';
              this.beneficiary.ordenantData.address += `C.P. ${ordenantResponse['CODIGO_POSTAL']}`;
            }
            this.beneficiary.ordenantData.city = `${ordenantResponse['LOCALIDAD']}, ${ordenantResponse['CIUDAD']}`;
            this.beneficiary.ordenantData.country = `${ordenantResponse['PAIS']}`;
            this.beneficiary.ordenantData.name = `${ordenantResponse['NOMBRE']}`;

            this.stepper['beneficiaryData'] = this.beneficiary;
            if (directDetail) {
              this.buttonClick.emit(0);
              if (response.benefStatus == 'ACTIVE') {
                this.stepper['beneficiaryData']['operationType'] = 'A';
              } else if (response.benefStatus == 'INACTIVE_PLD') {
                this.stepper['beneficiaryData']['operationType'] = 'I';
              } else {
                this.stepper['beneficiaryData']['operationType'] = 'R';
              }
              this.loading = false;
              this.stepper.selectedIndex = 1;
              this.stepper.selectedIndex = 2;
              this.stepper.selectedIndex = 3;
              scrollToTop();
            } else if (download) {
              this.loading = false;
              this.stepper.selectedIndex = 1;
            } else {
              this.loading = false;
              this.buttonClick.emit(1);
              this.stepper.selectedIndex = 1;
              this.stepper.selectedIndex = 2;
              scrollToTop();
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
      } else {
        this.loading = false;
        const dialogRef = this.dialog.open(ErrorDialog, {
          width: MODAL_SIZE.width,
          height: MODAL_SIZE.height,
          disableClose: true,
          data: {error: 'errors.no-found'}
        });
      }
    }, error => {
      this.loading = false;
      const dialogRef = this.dialog.open(ErrorDialog, {
        width: MODAL_SIZE.width,
        height: MODAL_SIZE.height,
        disableClose: true,
        data: {error: 'errors.genericError'}
      });
    });
  }

  download() {
    this.stepper.selectedIndex = 1;
  }
}
