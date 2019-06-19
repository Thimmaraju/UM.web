import { TestBed } from '@angular/core/testing';

import { CustomerContextService } from './customercontext.service';

describe('CustomerContextService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerContextService = TestBed.get(CustomerContextService);
    expect(service).toBeTruthy();
  });
});
