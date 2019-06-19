import { TestBed, getTestBed } from '@angular/core/testing';
import { DateService } from './date.service';
import { format, setYear } from 'date-fns';

describe('Date Service', () => {
  let injector: TestBed;
  let service: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [DateService]
    });

    injector = getTestBed();
    service = injector.get(DateService);
  });

  it('should exist', () => {
    expect(service).toBeTruthy();
  });

  it('determine generated dttm should return empty string when null', () => {
    const results = service.determineGeneratedOnDttm(null, null);
    expect(results).toBe('');
  });

  it('determine generated UTC dttm should return one of two dates', () => {
    const dateOne = new Date('2018-10-13T16:15:11.689Z');
    const dateTwo = new Date('2018-10-13T16:15:11.689Z');
    const results = service.determineGeneratedOnDttm(dateOne, dateTwo);
    const resultDate = new Date('2018-10-13T16:15:11.689Z');
    const localDate = format(resultDate, 'MM/DD/YYYY hh:mm A');
    expect(results).toBe(localDate);
  });

  it('determine generated UTC dttm should return one date when one is null', () => {
    const dateOne = new Date('2018-10-13T16:15:11.689Z');
    const dateTwo = null;
    const results = service.determineGeneratedOnDttm(dateOne, dateTwo);
    const resultDate = new Date('2018-10-13T16:15:11.689Z');
    const localDate = format(resultDate, 'MM/DD/YYYY hh:mm A');
    expect(results).toBe(localDate);
  });

  it('determine default empty date and return a string', () => {
    const dateOne = setYear(new Date(0o1, 0, 0), 0o0);
    const dateTwo = setYear(new Date(0o1, 0, 0), 0o0);
    const results = service.determineGeneratedOnDttm(dateOne, dateTwo);
    expect(results).toBe('');
  });
});
