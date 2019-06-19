import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersSharedModule } from '@app/users';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { SharedModule } from '@app/shared';

// Component
import { UserSiteAssociationComponent } from '@app/users';

describe('UserSiteAssociationComponent', () => {
  const userSites: any[] = [
    {
      id: 222,
      name: 'Facility 1',
      description: 'Facility 1 Desc',
      userAssociated: true,
    },
    {
      id: 333,
      name: 'Facility 2',
      description: 'Facility 2 Desc',
      userAssociated: true,
    },
  ];

  const userSite: any = {
    isPending: false,
    id: 222,
    name: 'Facility 1',
    description: 'Facility 1 Desc',
    userAssociated: true,
  };

  let component: UserSiteAssociationComponent;
  let fixture: ComponentFixture<UserSiteAssociationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UsersSharedModule, SharedModule],
      declarations: [UserSiteAssociationComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSiteAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.tempassociatedSites = userSites;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assign user sites to temporary array', () => {
    component.userSites = userSites;
    component.ngOnChanges();
    expect(component.tempassociatedSites).toBe(userSites);
  });

  it('handle role change should emit an event', () => {
    spyOn(component.associateSite, 'emit').and.callThrough();
    component.siteAssociated(userSite);
    expect(component.associateSite.emit).toHaveBeenCalled();

    userSite.isPending = true;
    component.siteAssociated(userSite);
    expect(component.associateSite.emit).toHaveBeenCalled();

    userSite.isPending = null;
    component.siteAssociated(userSite);
    expect(component.associateSite.emit).toHaveBeenCalled();
  });

  it('should assign all sites', () => {
    component.userSites = userSites;
    spyOn(component.associateSite, 'emit').and.callThrough();
    component.assignAllSites();
    expect(component.associateSite.emit).toHaveBeenCalled();

    userSites[0].isPending = true;
    component.userSites = userSites;
    component.assignAllSites();
    expect(component.associateSite.emit).toHaveBeenCalled();
  });

  it('should unassign all sites', () => {
    component.userSites = userSites;
    spyOn(component.associateSite, 'emit').and.callThrough();
    component.unassignAllSites();
    expect(component.associateSite.emit).toHaveBeenCalled();

    userSites[0].isPending = false;
    component.userSites = userSites;
    component.unassignAllSites();
    expect(component.associateSite.emit).toHaveBeenCalled();
  });

  it('should have user sites array', () => {
    component.userSites = userSites;
    expect(component.userSites).toEqual(userSites);
  });

  it('should subscribe to search box text after view initialization', () => {
    let expectedSearchText = 'Facility 1';
    component.searchElement.searchOutput$ = of(expectedSearchText);
    component.ngAfterViewInit();
    expect(component.searchElement.data).not.toBeNull();

    expectedSearchText = '';
    component.searchElement.searchOutput$ = of(expectedSearchText);
    component.ngAfterViewInit();
    expect(component.searchElement.data).toBe('');
  });
});
