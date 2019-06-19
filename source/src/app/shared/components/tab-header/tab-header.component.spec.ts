import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabHeaderComponent } from './tab-header.component';
import { TrimPipe } from '@app/shared/pipes/trim.pipe';
import { Pipe, PipeTransform } from '@angular/core';

describe('TabHeaderComponent', () => {
  @Pipe({ name: 'trim' })
  class MockTrimPipe implements PipeTransform {
    transform(args) {
      return 'unittest';
    }
  }

  let component: TabHeaderComponent;
  let fixture: ComponentFixture<TabHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TabHeaderComponent,
        MockTrimPipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
