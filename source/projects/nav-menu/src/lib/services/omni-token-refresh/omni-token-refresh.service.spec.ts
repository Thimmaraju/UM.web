import { TestBed } from '@angular/core/testing';

import { OmniTokenRefreshService } from './omni-token-refresh.service';

describe('OmniTokenRefreshService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OmniTokenRefreshService = TestBed.get(OmniTokenRefreshService);
    expect(service).toBeTruthy();
  });
});
