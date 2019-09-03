import {NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {MaterialModule} from './modules';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {
  DateComponent,
  FooterComponent,
  FullScreenSpinnerComponent,
  HeaderComponent,
  LogoutComponent,
  MenuComponent,
  MenuListItemComponent,
  NotesPopoverComponent,
  SpinnerComponent
} from './components';
import {Error404PageComponent} from './pages';
import {WebStorageModule} from 'ngx-store';
import {ClickOutsideDirective, NoDblClickMatDirective, ScrollToFirstInvalidDirective} from './directives';
import {UserTypePipe} from './filters/user-type.pipe';
import {SatPopoverModule} from '@ncstate/sat-popover';
import {TwoPaginatorCustomComponent} from './components/paginator-custom/paginator-custom.component';
import {ErrorDialog} from 'src/app/shared/components/error-modal/error-dialog-component';
import {MessageDialog} from './components/message-dialog/message-dialog.component';
import {AlterDialog} from './components/alter-dialog/alter-dialog.component';
import {NgxMaskModule, optionsConfig} from 'ngx-mask';
import {NgxCurrencyModule} from 'ngx-currency';
import {CurrencyMaskConfig} from 'ngx-currency/src/currency-mask.config';
import {DecisionDialog} from './components/decision-dialog/decision-dialog.component';
import {MOMENT_DATE_FORMATS, MomentDateAdapter} from './helpers/momend-date-adapter';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material';
import { WarningMessageComponent } from './components/warning-message/warning-message.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { TimeDialogComponent } from './components/time-dialog/time-dialog.component';

export const customCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'left',
  allowNegative: true,
  allowZero: true,
  decimal: '.',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: ',',
  nullable: true
};

const customNgxMaskConfig: optionsConfig = {
  dropSpecialCharacters: false
};

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    RouterModule,
    WebStorageModule,
    FormsModule,
    SatPopoverModule,
    NgxMaskModule.forRoot(customNgxMaskConfig),
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  declarations: [
    Error404PageComponent,
    HeaderComponent,
    FooterComponent,
    SpinnerComponent,
    ScrollToFirstInvalidDirective,
    MenuComponent,
    MenuListItemComponent,
    NotesPopoverComponent,
    DateComponent,
    UserTypePipe,
    FullScreenSpinnerComponent,
    LogoutComponent,
    ClickOutsideDirective,
    TwoPaginatorCustomComponent,
    ErrorDialog,
    MessageDialog,
    AlterDialog,
    WarningMessageComponent,
    DecisionDialog,
    BreadcrumbComponent,
    TimeDialogComponent,
    NoDblClickMatDirective
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    WebStorageModule,
    HeaderComponent,
    FooterComponent,
    SpinnerComponent,
    ScrollToFirstInvalidDirective,
    MenuComponent,
    NotesPopoverComponent,
    FormsModule,
    FullScreenSpinnerComponent,
    LogoutComponent,
    SatPopoverModule,
    ClickOutsideDirective,
    TwoPaginatorCustomComponent,
    ErrorDialog,
    MessageDialog,
    AlterDialog,
    NgxMaskModule,
    NgxCurrencyModule,
    DecisionDialog,
    WarningMessageComponent,
    BreadcrumbComponent,
    TimeDialogComponent,
    NoDblClickMatDirective
  ],
  entryComponents: [
    ErrorDialog,
    MessageDialog,
    AlterDialog,
    DecisionDialog,
    TimeDialogComponent
  ],
  providers: [
    DecimalPipe,
    {provide: DateAdapter, useClass: MomentDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS},
  ]
})

export class SharedModule {
}
