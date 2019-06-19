import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'deaClass' })

export class DeaClassPipe implements PipeTransform {
  transform(deaCode: any): string {

      if (deaCode === null || deaCode === undefined || deaCode === 0 || deaCode === '0') {
          return '';
      }
      const schedule = ['I', 'II', 'III', 'IV', 'V'][+deaCode - 1] || 'Rx';

      return 'C - ' + schedule;
  }
}
