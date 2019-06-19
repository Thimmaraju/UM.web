import { TestBed } from '@angular/core/testing';

import { CognitoProfileService } from './cognito-profile.service';

describe('CognitoProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CognitoProfileService = TestBed.get(CognitoProfileService);
    expect(service).toBeTruthy();
  });
});
