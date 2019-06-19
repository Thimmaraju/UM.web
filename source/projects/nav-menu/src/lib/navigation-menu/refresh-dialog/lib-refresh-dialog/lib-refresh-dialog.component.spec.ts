import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibRefreshDialogComponent } from './lib-refresh-dialog.component';

describe('LibRefreshDialogComponent', () => {
  let component: LibRefreshDialogComponent;
  let fixture: ComponentFixture<LibRefreshDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibRefreshDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibRefreshDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
