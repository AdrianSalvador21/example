import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {BaseComponent} from '../base/base.component';

@Component({
  selector: 'two-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent extends BaseComponent implements OnInit {
  currentLang: string;

  constructor(private translateService: TranslateService) {
    super();
  }

  ngOnInit() {
    this.currentLang = this.translateService.currentLang;
  }
}
