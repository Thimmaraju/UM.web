import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OktaPopupChangePasswordComponent } from './okta-popup-change-password.component';

describe('PopupChangePasswordComponent', () => {
  let component: OktaPopupChangePasswordComponent;
  let fixture: ComponentFixture<OktaPopupChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OktaPopupChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OktaPopupChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
