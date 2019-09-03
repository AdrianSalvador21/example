import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../../../configs/app.config';
import {ProgressBarService} from '../../../core/services/progress-bar.service';
import {LocalStorage} from 'ngx-store';
import {NotesPopoverComponent} from '../notes-popover';
import {MatDialog} from '@angular/material';
import {BaseComponent} from '../base/base.component';
import {MODAL_SIZE} from '../../helpers';

@Component({
  selector: 'two-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent extends BaseComponent implements OnInit {

  @Input()
  public showText: Boolean;

  @LocalStorage() language = 'es';

  progressBarMode: string;
  currentLang: string;
  sessionData;
  lastLoginDate: string;

  @Output()
  menuClicked = new EventEmitter();
  note: string;

  constructor(private progressBarService: ProgressBarService,
              private translateService: TranslateService, public dialog: MatDialog) {
    super();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NotesPopoverComponent, {
      width: MODAL_SIZE.width,
      height: MODAL_SIZE.height,
      disableClose: true,
      data: {note: this.note}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.note = result;
    });
  }

  ngOnInit() {
    this.currentLang = this.translateService.currentLang;
    this.progressBarService.updateProgressBar$.subscribe((mode: string) => {
      this.progressBarMode = mode;
    });
    this.sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    this.lastLoginDate = this.sessionData.lastLoginDate.replace(new RegExp('-', 'g'), '/');
    this.lastLoginDate = this.lastLoginDate.replace(this.lastLoginDate.slice(-3), '');
  }

  onMenuClicked(evt) {
    this.menuClicked.emit(evt);
  }
}


