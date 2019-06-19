import { Customer } from '@app/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@app/shared';
import { TenantDetailsComponent } from './tenant-details.component';

describe('Total Summary Component', () => {
  let component: TenantDetailsComponent;
  let fixture: ComponentFixture<TenantDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [TenantDetailsComponent]
    });

    fixture = TestBed.createComponent(TenantDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('on init it should do checks', () => {
    spyOn(component, 'doChecks');

    component.ngOnInit();

    expect(component.doChecks).toHaveBeenCalled();
  });

  it('on changes it should do checks', () => {
    spyOn(component, 'doChecks');

    component.ngOnChanges();

    expect(component.doChecks).toHaveBeenCalled();
  });

  it('on check if selected with selected tenant id', () => {
    spyOn(component, 'findTenantName');
    component.selectedTenentId = 'foo';
    component.checkIfSelected();
    expect(component.findTenantName).toHaveBeenCalled();
  });

  it('on check if selected with no selected tenant id', () => {
    spyOn(component, 'findTenantName');
    spyOn(component, 'checkIfDefault');
    component.selectedTenentId = '';
    component.checkIfSelected();
    expect(component.findTenantName).not.toHaveBeenCalled();
    expect(component.checkIfDefault).toHaveBeenCalled();
  });

  it('on check if disabled when true', () => {
    component.isSelectionDisabled = 'true';
    component.checkIfSelectionIsDisabled();
    expect(component.displaySelection).toBeFalsy();
  });

  it('on check if disabled when false ', () => {
    component.isSelectionDisabled = 'false';
    component.checkIfSelectionIsDisabled();
    expect(component.displaySelection).toBeTruthy();
  });

  it('on check if default with tenants ', () => {
    const validTenant: Customer = {
      customerId: '123',
      name: 'testTenant',
      info: 'info',
      updateTime: new Date()
    };
    const tenants: Customer[] = [];
    spyOn(component, 'newTenantSelected');

    tenants.push(validTenant);

    component.tenants = tenants;
    component.checkIfDefault();

    expect(component.newTenantSelected).toHaveBeenCalled();
  });

  it('on check if default with no tenants ', () => {
    const tenants: Customer[] = [];
    spyOn(component, 'newTenantSelected');

    component.tenants = tenants;
    component.checkIfDefault();

    expect(component.newTenantSelected).not.toHaveBeenCalled();
  });

  it('on find tenant name with tenants ', () => {
    const validTenant: Customer = {
      customerId: '123',
      name: 'testTenant',
      info: 'info',
      updateTime: new Date()
    };
    const tenants: Customer[] = [];
    tenants.push(validTenant);

    const results = component.findTenantName('123', tenants);

    expect(results).toBe('testTenant');
  });

  it('should emit new tenant when clicked', () => {
    spyOn(component.newTenant, 'emit').and.callThrough();
    component.newTenantSelected('foo');
    expect(component.newTenant.emit).toHaveBeenCalled();
  });
});
