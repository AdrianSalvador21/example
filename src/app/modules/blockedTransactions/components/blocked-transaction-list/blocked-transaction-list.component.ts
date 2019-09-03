import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MODAL_SIZE, scrollToTop} from '../../../../shared/helpers';
import {MatDialog, MatStepper} from '@angular/material';
import {DecisionDialog} from '../../../../shared/components/decision-dialog/decision-dialog.component';
import {TwoPaginatorCustomComponent} from '../../../../shared/components/paginator-custom/paginator-custom.component';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'two-blocked-transaction-list',
  templateUrl: './blocked-transaction-list.component.html',
  styleUrls: ['./blocked-transaction-list.component.scss']
})
export class BlockedTransactionListComponent implements OnInit, AfterViewInit {
  @Input() stepper: MatStepper;
  @ViewChild(TwoPaginatorCustomComponent) paginator: TwoPaginatorCustomComponent;
  @Output() paginatorChange = new EventEmitter();
  listData;
  listTotal = 0;
  message = '';
  itemSelected;
  displayedColumns: string[] = ['select', 'date', 'service', 'amount', 'name', 'ordenant', 'documentType', 'documentNumber', 'bank', 'country', 'benefType', 'channel', 'status', 'authUser', 'authDate', 'authTime'];

  constructor(public dialog: MatDialog) {
  }

  @Input()
  set listDataInput(value) {
    this.listTotal = value[0].total;
    this.listData = value;
    // this.listTotal = parseInt (this.listData[0].total);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() => {
          this.paginatorChange.emit(this.paginator.pageIndex + 1);
        })
      )
      .subscribe();
  }

  assignRegister(item) {
    this.itemSelected = item;
  }

  onModify(isAuthorizing: boolean) {
    if (isAuthorizing) {
      this.message = 'blockedTransactions.modalAuthMessage';
    } else {
      this.message = 'blockedTransactions.modalRejectMessage';
    }
    const dialogRef = this.dialog.open(DecisionDialog, {
      width: MODAL_SIZE.width,
      height: MODAL_SIZE.height,
      disableClose: true,
      data: {message: this.message}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Y') {
        this.stepper['transactionData'] = this.itemSelected;
        if (isAuthorizing) {
          // autorizar aqui
          this.stepper['statusTransaction'] = 'Autorizado';
        } else {
          // rechazar aqui
          this.stepper['statusTransaction'] = 'Rechazado';
        }
        this.stepper.next();
        scrollToTop();
      } else {
        return;
      }
    });
  }

}
