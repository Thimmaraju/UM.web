import { TestBed } from '@angular/core/testing';

import { LibToasterService } from './lib-toaster.service';

describe('LibToasterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LibToasterService = TestBed.get(LibToasterService);
    expect(service).toBeTruthy();
  });
});
