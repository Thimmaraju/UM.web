import { Pipe, PipeTransform } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DeaClassPipe } from './deaClass.pipe';

describe('Pipe: Dea Class', () => {
  let pipe: DeaClassPipe;

  beforeEach(() => {
    pipe = new DeaClassPipe();
  });

  it('should return a empty string when we dont have a valid value', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should have 6 equal Rx', () => {
    expect(pipe.transform(6)).toBe('C - Rx');
  });

  it('should have 1 equal C - I', () => {
    expect(pipe.transform(1)).toBe('C - I');
  });
});
