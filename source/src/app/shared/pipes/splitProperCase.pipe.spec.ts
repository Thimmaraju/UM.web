import { Pipe, PipeTransform } from '@angular/core';
import { SplitProperCase } from './splitProperCase.pipe';

describe(' Pipe: Round Down', () => {

  let pipe: SplitProperCase;

  beforeEach(() => {
    pipe = new SplitProperCase();
  });

  it('should split a ProperCase to a spaced string', () => {
    expect(pipe.transform('ProperCase')).toBe('Proper Case');
  });

  it('should not affect Spaced Strings', () => {
    expect(pipe.transform('Proper Case')).toBe('Proper Case');
  });
});
