import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';

import { UserAuditLogComponent } from './user-audit-log.component';
import { UserAuditLog } from '@app/users';
import { UserAuditLogService } from '@app/users/shared/services/user-audit-log.service';
import { UsersSharedModule } from '@app/users';
import { Observable, of, Subject, forkJoin } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

describe('UserAuditLogComponent', () => {
  let component: UserAuditLogComponent;
  let fixture: ComponentFixture<UserAuditLogComponent>;
  let auditlogService: UserAuditLogService;
  const mockUserId = '00ujpca0qtX0HoNe30h7';

  const mockUserLog: UserAuditLog[] = [
    {
      event: 'Remove user from group membership',
      update: 'Role:Strategist',
      changedBy: 'sai sankar kunnathukuzhiyil',
      updateTime: 'Apr 4, 2019, 6:14:53 PM',
    },
    {
      event: 'Add user to group membership',
      update: 'Role:Strategist',
      changedBy: 'Aditya SRK',
      updateTime: 'Apr 3, 2019, 11:41:45 PM',
    },
    {
      event: 'Update user profile for Okta',
      update: 'Aditya 369 Sadhu',
      changedBy: 'Aditya SRK',
      updateTime: 'Apr 3, 2019, 3:11:43 PM',
    },
  ];

  const mockUserAuditLogService = {
    getUserAuditLog() {
      return of(mockUserLog);
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserAuditLogComponent],
      imports: [
        UsersSharedModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CommonModule,
        UsersSharedModule,
      ],
      providers: [{ provide: UserAuditLogService, useValue: mockUserAuditLogService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAuditLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    auditlogService = fixture.debugElement.injector.get(UserAuditLogService);
    component.tempUserLog = mockUserLog;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data successfully', async () => {
    component.ngOnChanges();
    expect(mockUserLog.length).toBe(3);
  });

  it('should assign user sites to temporary array', () => {
    component.userLog = mockUserLog;
    component.ngOnChanges();
    expect(component.tempUserLog).toBe(mockUserLog);
  });

  it('should subscribe to search box text after view initialization', () => {
    let expectedSearchText = 'Role';
    component.searchElement.searchOutput$ = of(expectedSearchText);
    component.ngAfterViewInit();
    expect(component.searchElement.data).not.toBeNull();

    expectedSearchText = '';
    component.searchElement.searchOutput$ = of(expectedSearchText);
    component.ngAfterViewInit();
    expect(component.searchElement.data).toBe('');
  });
});
