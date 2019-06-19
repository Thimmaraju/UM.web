import { Component, OnInit, OnChanges, Input, ViewChild, AfterViewInit } from '@angular/core';
import { UserAuditLogService } from '@app/users';
import { UserAuditLog } from '@app/users';
import { SearchBoxComponent } from '@app/shared';
import { Observable, of, Subject, forkJoin } from 'rxjs';
import { switchMap, filter, takeUntil, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'pc-user-audit-log',
  template: `
    <div class="container mat-elevation-z8" #auditLog>
      <div class="row UserAuditLog">
        <oc-search-box #searchBox placeHolderText="Search"></oc-search-box>
      </div>
      <div>
        <div class="auditlog">
          <oc-grid #ocgrid ocgridfilter="false" style="height:440px">
            <ng-container class="ocgridheader">
              <div class="first"></div>
              <div class="col width-event ellipsis">Event</div>
              <div class="col width-values ellipsis">Updated Values</div>
              <div class="col width-update ellipsis">Changed By</div>
              <div class="col width-time ellipsis">Time</div>
            </ng-container>
            <ng-container class="ocgridbody">
              <div class="row" *ngFor="let log of userLog">
                <div class="first"></div>
                <div class="col width-event ellipsis" [attr.data-title]="'event'" title="{{ log.event }}">
                  {{ log.event }}
                </div>
                <div class="col width-values ellipsis" [attr.data-title]="'update'" title="{{ log.update }}">
                  {{ log.update }}
                </div>
                <div class="col width-update ellipsis" [attr.data-title]="'changedBy'" title="{{ log.changedBy }}">
                  {{ log.changedBy }}
                </div>
                <div class="col width-time ellipsis" [attr.data-title]="'updateTime'">
                  {{ log.updateTime | date: 'medium' }}
                </div>
              </div>
            </ng-container>
          </oc-grid>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./user-audit-log.component.scss'],
})
export class UserAuditLogComponent implements OnInit, OnChanges, AfterViewInit {
  userLog: UserAuditLog[] = [];
  tempUserLog: UserAuditLog[] = [];

  @Input() currentuserId: string;
  @ViewChild('searchBox') searchElement: SearchBoxComponent;

  constructor(private _auditService: UserAuditLogService) {}

  ngOnInit() {}

  ngOnChanges() {
    this._auditService.getUserAuditLog(this.currentuserId).subscribe(
      (result: UserAuditLog[]) => {
        this.userLog = result;
        this.tempUserLog = result;
      },
      (error) => {
      }
    );
  }

  ngAfterViewInit() {
    this.searchElement.searchOutput$
      .pipe(
        switchMap((searchData: string) => {
          return of(searchData);
        }),
        debounceTime(250)
      )
      .subscribe(
        (data) => {
          this.userLog = this.tempUserLog.filter(
            (log) =>
              ((log.event !== null || log.event !== undefined) && log.event.toLowerCase().includes(data.toLowerCase())) ||
              ((log.update !== null || log.update !== undefined) && log.update.toLowerCase().includes(data.toLowerCase())) ||
              ((log.changedBy !== null || log.changedBy !== undefined) &&
                log.changedBy.toLowerCase().includes(data.toLowerCase()))
          );
        },
        (error) => console.log(error)
      );
  }
}
