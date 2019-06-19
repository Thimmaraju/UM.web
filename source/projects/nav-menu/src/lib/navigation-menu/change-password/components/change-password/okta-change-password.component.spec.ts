import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OktaChangePasswordComponent } from './okta-change-password.component';

describe('OktaChangePasswordComponent', () => {
  let component: OktaChangePasswordComponent;
  let fixture: ComponentFixture<OktaChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OktaChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OktaChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
