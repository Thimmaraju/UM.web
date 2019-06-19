import { NotApplicablePipe } from './not-applicable.pipe';

describe('Pipe: Not Applicable', () => {
  let pipe: NotApplicablePipe;

  beforeEach(() => {
    pipe = new NotApplicablePipe();
  });

  it('should return N/A when empty', () => {
    expect(pipe.transform(null)).toBe('N/A');
  });
  it('should return value passed when not empty string', () => {
    expect(pipe.transform('foo')).toBe('foo');
  });
  it('should return value passed when not empty number', () => {
    expect(pipe.transform(2)).toBe(2);
  });
});
