import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabInfoComponent } from './tab-info.component';

describe('TabInfoComponent', () => {
  let component: TabInfoComponent;
  let fixture: ComponentFixture<TabInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
