import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileviewerComponent } from './profileviewer.component';

describe('ProfileviewerComponent', () => {
  let component: ProfileviewerComponent;
  let fixture: ComponentFixture<ProfileviewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileviewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
