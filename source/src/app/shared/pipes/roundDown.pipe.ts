import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'roundDown' })

export class RoundDownPipe implements PipeTransform {
  transform(numberValue: number): number {
    return Math.floor(numberValue);
  }
}
