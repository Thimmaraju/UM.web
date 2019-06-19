import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CognitoUtil, CognitoCallback, LoggedInCallback, Callback } from '@app/core';

import { ProfileService } from './profile.service';

describe('Login Viewer Component', () => {

  let profileService: ProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CognitoUtil,
        ProfileService
      ]
    });

    httpMock = TestBed.get(HttpTestingController);
    profileService = TestBed.get(ProfileService);
  });

  it('should be created', () => {
    expect(profileService).toBeTruthy();
  });

});
