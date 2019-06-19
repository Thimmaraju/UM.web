import { Pipe, PipeTransform } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RoundDownPipe } from './roundDown.pipe';

describe(' Pipe: Round Down', () => {

  let pipe: RoundDownPipe;

  beforeEach(() => {
    pipe = new RoundDownPipe();
  });

  it('should round down a number', () => {
    expect(pipe.transform(1.4)).toBe(1);
  });
});
