import { TestBed } from '@angular/core/testing';

import { LibCognitoService } from './lib-cognito.service';

describe('LibCognitoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LibCognitoService = TestBed.get(LibCognitoService);
    expect(service).toBeTruthy();
  });
});
