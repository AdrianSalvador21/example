import {animate, AnimationTriggerMetadata, style, transition, trigger} from '@angular/animations';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {AbstractControl, Validators} from '@angular/forms';
import * as moment from 'moment';
import {Moment} from 'moment';

declare const require;
const bowser = require('bowser');

export const scrollToElement = (element) => {
  if (element) {
    const distance = window.pageYOffset - Math.abs(element.getBoundingClientRect().y);

    window.scroll({
      behavior: 'smooth',
      left: 0,
      top: element.getBoundingClientRect().top + window.scrollY - 150
    });

    setTimeout(() => {
      element.focus();
      element.blur(); // Trigger error messages
      element.focus();
    }, distance);
  }
};

export const isBrowserValid = () => {
  const browser = bowser.getParser(window.navigator.userAgent);
  return browser.satisfies({
    windows: {
      'internet explorer': '>10',
    },
    macos: {
      safari: '>10.1'
    },
    chrome: '>20.1.1432',
    firefox: '>31',
    opera: '>22'
  });
};

export const fadeInOut: AnimationTriggerMetadata = trigger('fadeInOut', [
  transition(':enter', [
    style({opacity: 0}),
    animate(500, style({opacity: 1}))
  ]),
  transition(':leave', [
    animate(500, style({opacity: 0}))
  ])
]);

export const loadSVGIcons = (iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) => {
  iconRegistry.addSvgIcon(
    'bars',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/bars.svg'));
  iconRegistry.addSvgIcon(
    'downloadFile',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/downloadFile.svg'));
  iconRegistry.addSvgIcon(
    'calendario',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/calendario.svg'));
  iconRegistry.addSvgIcon(
    'ayuda',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ayuda.svg'));
  iconRegistry.addSvgIcon(
    'autorizador',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/autorizador.svg'));
  iconRegistry.addSvgIcon(
    'checked',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/checked.svg'));
  iconRegistry.addSvgIcon(
    'greenChecked',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/checked2.svg'));
  iconRegistry.addSvgIcon(
    'cancel',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/cancel.svg'));
  iconRegistry.addSvgIcon(
    'history',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/consulta-historicos.svg'));
  iconRegistry.addSvgIcon(
    'close-box',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/close-box.svg'));
  iconRegistry.addSvgIcon(
    'consultas',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/consultas.svg'));
  iconRegistry.addSvgIcon(
    'consultas-por-archivo',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/consultas-por-archivo.svg'));
  iconRegistry.addSvgIcon(
    'descargar',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/descargar.svg'));
  iconRegistry.addSvgIcon(
    'estatus-ops',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/estatus-ops.svg'));
  iconRegistry.addSvgIcon(
    'imprimir',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/imprimir.svg'));
  iconRegistry.addSvgIcon(
    'notas',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/icono_notas.svg'));
  iconRegistry.addSvgIcon(
    'oficina',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/oficina.svg'));
  iconRegistry.addSvgIcon(
    'pld-operador',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/pld-operador.svg'));
  iconRegistry.addSvgIcon(
    'usuario',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/usuario.svg'));
  iconRegistry.addSvgIcon(
    'config-perfiles',
    sanitizer.bypassSecurityTrustResourceUrl('assets/icons/config-perfiles.svg'));
};

export const deepCopy = (oldObj: any) => {
  var newObj = oldObj;
  if (oldObj && typeof oldObj === 'object') {
    newObj = Object.prototype.toString.call(oldObj) === '[object Array]' ? [] : {};
    for (var i in oldObj) {
      newObj[i] = deepCopy(oldObj[i]);
    }
  }
  return newObj;
};

export const MODAL_SIZE = {width: '384', height: '256px', invalidSessionHeigth: '400px'};

export function CustomValidateEmail(control: AbstractControl) {
  if (!control.value) {
    return true;
  }

  const regexEmail = /^[a-zA-Z0-9.-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i;
  return Validators.pattern(regexEmail);
}

export function applyCurrencyMask(isNumber: boolean, rawValue: string): string {
  const {allowNegative, decimal, precision, prefix, suffix, thousands} = {
    allowNegative: true,
    decimal: '.',
    precision: 2,
    prefix: '',
    suffix: '',
    thousands: ','
  };
  rawValue = isNumber ? new Number(rawValue).toFixed(precision) : rawValue;
  let onlyNumbers = rawValue.replace(/[^0-9]/g, '');

  if (!onlyNumbers) {
    return '';
  }

  let integerPart = onlyNumbers.slice(0, onlyNumbers.length - precision).replace(/^0*/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, thousands);

  if (integerPart == '') {
    integerPart = '0';
  }

  let newRawValue = integerPart;
  let decimalPart = onlyNumbers.slice(onlyNumbers.length - precision);

  if (precision > 0) {
    decimalPart = '0'.repeat(precision - decimalPart.length) + decimalPart;
    newRawValue += decimal + decimalPart;
  }

  let isZero = parseInt(integerPart) == 0 && (parseInt(decimalPart) == 0 || decimalPart == '');
  let operator = (rawValue.indexOf('-') > -1 && allowNegative && !isZero) ? '-' : '';
  return operator + prefix + newRawValue + suffix;
}

export function scrollToTop() {
  /*const stepElement = document.getElementById('app-main-container');*/
  setTimeout(() => {
    /*stepElement.scrollIntoView({block: 'start', inline: 'nearest', behavior: 'instant'});*/
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }, 1);
}

export function minDate(): Moment {
  return moment().startOf('day').add(-1, 'years');
}

export function maxDate(): Moment {
  return moment().endOf('day');
}

export function currentDate(): Moment {
  return moment().startOf('day');
}

export function currentDateWithTime(): Moment {
  return moment();
}

export function clientNumberMask(accountNumber): string {
  let account = '';
  let accountLength = accountNumber.length;
  let maskLength = accountLength - 3;
  for (let i = 0; i < accountLength; i++) {
    if (i < maskLength) {
      account += '*';
    } else {
      account += accountNumber[i];
    }
  }
  return account;
}
