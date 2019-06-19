import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'splitpropercase' })

export class SplitProperCase implements PipeTransform {
  transform(properCaseString: string): string {
    if (properCaseString && properCaseString.length > 0) {
      return properCaseString.match(/[A-Z][a-z]+/g).join(' ');
    } else {
      return properCaseString;
    }
  }
}
