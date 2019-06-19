import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { OmniTokenRefreshService } from '../../../services/omni-token-refresh/omni-token-refresh.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'pc-lib-refresh-dialog',
  styleUrls: ['./lib-refresh-dialog.component.scss'],
  template: `
    <div id="RefreshSessionDialog" class="dialog-container">
      <div class="dialog-header" mat-dialog-title><span class="title">Continue Working?</span></div>
      <mat-dialog-content class="dialog-content">
        <div class="content-body">We've detected you have been inactive.</div>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button id="ContinueWorkingButton" mat-raised-button color="primary" (click)="handleClick()">Continue Working</button>
      </mat-dialog-actions>
    </div>
  `,
})
export class LibRefreshDialogComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();

  constructor(
    private _dialogRef: MatDialogRef<LibRefreshDialogComponent>,
    private _tokenRefreshService: OmniTokenRefreshService
  ) {}

  ngOnInit() {
    this._tokenRefreshService
      .hasBeenRefreshed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(newToken => {
        if (newToken) {
          this.closeModel();
        }
      });
  }

  closeModel(): void {
    this._dialogRef.close();
  }

  handleClick(): void {
    this._tokenRefreshService.refreshToken();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
