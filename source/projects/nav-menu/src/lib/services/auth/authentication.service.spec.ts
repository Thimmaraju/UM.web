import { TestBed } from '@angular/core/testing';

import { AuthServiceLib } from './authentication.service';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthServiceLib = TestBed.get(AuthServiceLib);
    expect(service).toBeTruthy();
  });
});
