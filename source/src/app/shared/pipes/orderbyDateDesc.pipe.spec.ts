import { Pipe, PipeTransform } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OrderByDateDescPipe } from './orderbyDateDesc.pipe';

describe('Pipe: Order By Date Desc Pipe', () => {
  let pipe: OrderByDateDescPipe;

  beforeEach(() => {
    pipe = new OrderByDateDescPipe();
  });

  it('should sort the dates corectly', () => {
    const oldDate = {'dateField': new Date('2017-01-01') };
    const olderDate = {'dateField': new Date('2016-01-01') };

    let arrayToSort: any[];
    arrayToSort = [];
    arrayToSort.push(olderDate);
    arrayToSort.push(oldDate);

    let goodArray: any[];
    goodArray = [];
    goodArray.push(oldDate);
    goodArray.push(olderDate);

    expect(pipe.transform(arrayToSort, 'dateField')).toEqual(goodArray);
  });
});
