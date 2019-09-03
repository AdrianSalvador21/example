import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'userType'
})
export class UserTypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.split(' ')[1];
  }

}
