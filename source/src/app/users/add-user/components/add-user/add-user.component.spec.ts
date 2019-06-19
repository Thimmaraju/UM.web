import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AdduserComponent } from './add-user.component';
import { FormBuilder } from '@angular/forms';

describe('AdduserComponent', () => {
  let component: AdduserComponent;
  let fixture: ComponentFixture<AdduserComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ AdduserComponent ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdduserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async(inject([HttpClientTestingModule],
    (httpClient: HttpClientTestingModule) => {
    expect(component).toBeTruthy();
  })));

  it('form invalid when empty', () => {
    expect(component.userForm.valid).toBeFalsy();
  });

  it('form fields validity', () => {
    const login = component.userForm.controls['login'];
    const email = component.userForm.controls['email'];
    const firstname = component.userForm.controls['firstname'];
    const lastname = component.userForm.controls['lastname'];
    expect(login.valid).toBeFalsy();
    expect(email.valid).toBeFalsy();
    expect(firstname.valid).toBeFalsy();
    expect(lastname.valid).toBeFalsy();

    let errors = {};
    login.setValue('');
    email.setValue('');
    firstname.setValue('');
    lastname.setValue('');
    errors = login.errors || email.errors || firstname.errors || lastname.errors || {};
    expect(errors['required']).toBeTruthy();
  });
});
