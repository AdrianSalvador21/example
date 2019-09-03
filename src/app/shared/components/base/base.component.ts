import {clientNumberMask, currentDate, maxDate, minDate} from '../../helpers';
import {Moment} from 'moment';
import {AppConfig} from '../../../configs/app.config';

export abstract class BaseComponent {
  regexAlias = /^[^=~<>^|°¨¬]+$/;
  regexAlphaNumericAndSpaces = /^[0-9a-zA-Z\s]+$/;
  regexAlphaNumeric = /^[0-9a-zA-Z\s]+$/;
  regexNumber = /^[0-9]+$/;
  regexCURP = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
  regexRFC = /^[A-Z]{3,4}[0-9]{2}((0[1-9]|1[012])(0[1-9]|1[0-9]|2[0-9])|(0[13456789]|1[012])(29|30)|(0[13578]|1[02])31)[0-9A-Z]{0,3}$/;
  regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  patternAlphaNumericAndSpaces = {'#': {pattern: new RegExp(/[0-9a-zA-Z\s]/)}};
  patternAlphaNumeric = {'#': {pattern: new RegExp(/^[0-9a-zA-Z]$/)}};
  patternAlpha = {'#': {pattern: new RegExp(/^[a-zA-Z]$/)}};
  patternUserName = {'#': {pattern: AppConfig.userName.regex}};
  patternAllChars = {'#': {pattern: new RegExp(/./)}};
  patternEmail = {'#': {pattern: new RegExp(/^[\-_\.@0-9a-zA-Z]$/)}};
  patternAlias = {'#': {pattern: new RegExp(/^[^\][\=~<¨>^|°¬]$/)}};
  patternFile = {'#': {pattern: new RegExp(/^[_\-0-9a-zA-Z]$/)}};

  userNameMaxLength = AppConfig.userName.maxLength;

  get currentDate(): Moment {
    return currentDate();
  }

  get maxDate(): Moment {
    return maxDate();
  }

  get minDate(): Moment {
    return minDate();
  }

  clientNumberMask(account): string {
    return clientNumberMask(account);
  }
}
