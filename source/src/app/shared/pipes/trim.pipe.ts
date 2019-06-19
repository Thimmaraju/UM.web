import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim'
})
export class TrimPipe implements PipeTransform {

  transform(value: string, allWhiteSpace = false): any {
    if (!(value || typeof value === 'string')) {
      return value;
    }

    return allWhiteSpace ? value.replace(/\s/g, '') : value.trim();
  }
}
