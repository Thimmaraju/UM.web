import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'notApplicable' })
export class NotApplicablePipe implements PipeTransform {
  transform(data: any): any {
    return this.checkValueForType(data) ? data : 'N/A';
  }

  checkValueForType(data: any) {
    if (typeof data === 'string') {
      return data && data.length > 0;
    }

    if (typeof data === 'number') {
      return Number.isInteger(data);
    }
  }
}
