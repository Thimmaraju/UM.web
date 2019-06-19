import { TrimPipe } from './trim.pipe';

describe('TrimPipe', () => {
  it('create an instance', () => {
    const pipe = new TrimPipe();
    expect(pipe).toBeTruthy();
  });

  it('should trim leading and trailing white space chars', () => {
    const pipe = new TrimPipe();
    const text = ' space at the front and end of string ';
    const expected = 'space at the front and end of string';

    expect(pipe.transform(text)).toBe(expected);
  });

  it('should trim all white space chars', () => {
    const pipe = new TrimPipe();
    const text = ' space at the front between and end of string ';
    const expected = 'spaceatthefrontbetweenandendofstring';

    expect(pipe.transform(text, true)).toBe(expected);
  });
});
