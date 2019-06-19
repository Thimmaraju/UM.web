import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'orderbyDateDesc' })

export class OrderByDateDescPipe implements PipeTransform {
  transform(array: any[], field: string): any[] {

    array.sort((a: any, b: any) => {

      const date1 = new Date(a[field]);
      const date2 = new Date(b[field]);

      if (date1 > date2) {
        return -1;
      } else if (date1 < date2) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}
