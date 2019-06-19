import { TestBed } from '@angular/core/testing';

import { OmniTokenValidationService } from './omni-token-validation.service';

describe('OmniTokenValidationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OmniTokenValidationService = TestBed.get(OmniTokenValidationService);
    expect(service).toBeTruthy();
  });
});
