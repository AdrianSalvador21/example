import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'two-file-detail',
  templateUrl: './file-detail.component.html',
  styleUrls: ['./file-detail.component.scss']
})
export class FileDetailComponent implements OnInit {

  @Input('rows') rows;

  constructor() {
  }

  ngOnInit() {
  }

}
