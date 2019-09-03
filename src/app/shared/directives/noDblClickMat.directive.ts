// Angular Directive - Prevent double click for angular 6 material button (6.2)
// using Angular 6, Angular material button: 6.2.1
import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appNoDblClickMat]'
})
export class NoDblClickMatDirective {

  constructor() {
  }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    // see if the srcElement has the disabled property.  If so then it is the actual button.  If not then the user
    // clicked on the button's text (span element)
    if(window['processingButton'] === 1){
      event.preventDefault();
      event.stopPropagation();
      console.info('Preventing double button click');
    }else{
      window['processingButton'] = 1;
    }
    setTimeout(function () {
      window['processingButton'] = 0;
    }, 500);
  }
}
