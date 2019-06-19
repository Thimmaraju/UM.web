import { TestBed } from '@angular/core/testing';

import { AppListService } from './app-list.service';

describe('AppListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppListService = TestBed.get(AppListService);
    expect(service).toBeTruthy();
  });
});
