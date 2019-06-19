import { TestBed } from '@angular/core/testing';

import { OmniTokenService } from './omni-token.service';

describe('OmniTokenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OmniTokenService = TestBed.get(OmniTokenService);
    expect(service).toBeTruthy();
  });
});
