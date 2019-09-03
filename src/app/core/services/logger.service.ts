import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  static info(msg: string): void {
    console.info(msg);
  }

  static log(msg: string): void {
    console.log(msg);
  }

  static error(msg: string, obj = {}): void {
    console.error(msg, obj);
  }

  static debug(msg: string, obj = {}): void {
    console.debug(msg, obj);
  }
}
