import { Component, OnChanges, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { SearchBoxComponent } from '@app/shared';
import { UserSiteAssociation } from '@app/users';
import { Observable, of, Subject, forkJoin } from 'rxjs';
import { switchMap, filter, takeUntil, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'pc-user-site-association',
  styleUrls: ['./user-site-association.component.scss'],
  template: `
    <div class="container mat-elevation-z8">
      <div class="row AssignSites">
        <oc-button-action
          mode="secondary"
          [buttonText]="'Assign All Sites'"
          (click)="assignAllSites()"
        ></oc-button-action>
        &nbsp;&nbsp;
        <oc-button-action
          mode="secondary"
          [buttonText]="'Unassign All Sites'"
          (click)="unassignAllSites()"
        ></oc-button-action>
        &nbsp;&nbsp;
        <oc-search-box #searchBox placeHolderText="Search"></oc-search-box>
      </div>

      <div class="siteinfo">
        <oc-grid #ocgrid ocgridfilter="false" style="height:250px">
          <ng-container class="ocgridheader">
            <div class="first"></div>
            <div class="col width-common30 nowrap" style="display:none;">ID</div>
            <div class="siteName">Name</div>
            <div class="col width-common30 nowrap">Description</div>
            <div class="gridrightmarginheader">User Access</div>
          </ng-container>
          <ng-container class="ocgridbody" *ngIf="!userSites?.length">
            <div class="background">
              <h1>There are no facilities available</h1>
            </div>
          </ng-container>
          <ng-container class="ocgridbody" *ngIf="userSites?.length">
            <div class="background" *ngIf="!userSites?.length">
              <h1>There are no facilities available</h1>
            </div>
            <div class="row" *ngFor="let item of userSites">
              <div class="first"><img [src]="pendingimage" *ngIf="item.isPending" /></div>
              <div class="col" [attr.data-title]="'id'" style="display:none;">{{ item.id }}</div>
              <div class="siteName" [attr.data-title]="'name'">{{ item.name }}</div>
              <div class="col width-common30 nowrap sitedesc" ocGridColwrap [attr.data-title]="'description'">
                {{ item.description }}
              </div>
              <div class="togglebuttonc">
                <oc-button-toggle
                  [onLabel]="'Yes'"
                  [offLabel]="'No'"
                  [(ngModel)]="item.userAssociated"
                  (change)="siteAssociated(item)"
                >
                </oc-button-toggle>
              </div>
            </div>
          </ng-container>
        </oc-grid>
      </div>
    </div>
  `,
})
export class UserSiteAssociationComponent implements OnChanges, AfterViewInit {
  @Input() userSites: UserSiteAssociation[];
  @Output() associateSite = new EventEmitter();
  @ViewChild('searchBox') searchElement: SearchBoxComponent;
  pendingimage = require('../../../../../assets/PendingBadgeSlate.png');
  tempassociatedSites: UserSiteAssociation[];

  constructor() {}

  ngOnChanges() {
    this.tempassociatedSites = this.userSites;
  }

  siteAssociated(item: any) {
    if (item) {
      item.isPending = item.isPending ? false : !item.isPending ? true : false;
      this.associateSite.emit(item);
    }
  }

  assignAllSites() {
    this.userSites.forEach((userSite) => {
      userSite.userAssociated = true;
      userSite.isPending = userSite.isPending ? false : !userSite.isPending ? true : false;
      this.associateSite.emit(userSite);
    });
  }

  unassignAllSites() {
    this.userSites.forEach((userSite) => {
      userSite.userAssociated = false;
      userSite.isPending = userSite.isPending ? false : !userSite.isPending ? true : false;
      this.associateSite.emit(userSite);
    });
  }

  ngAfterViewInit() {
    this.searchElement.searchOutput$
      .pipe(debounceTime(250))
      .pipe(
        switchMap((searchData: string) => {
          return of(searchData);
        })
      )
      .subscribe((data) => {
        this.userSites = this.tempassociatedSites.filter(
          (userSite) =>
            (userSite.name !== '' &&
              userSite.name !== undefined &&
              userSite.name !== null &&
              userSite.name.toLowerCase().includes(data.toLowerCase())) ||
            (userSite.description !== '' &&
              userSite.description !== null &&
              userSite.description !== undefined &&
              userSite.description.toLowerCase().includes(data.toLowerCase()))
        );
      });
  }
}
