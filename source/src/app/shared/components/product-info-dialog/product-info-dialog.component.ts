import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

export interface ProductInformationModel {
  version: string;
}

@Component({
  selector: 'pc-product-info-dialog',
  styleUrls: ['./product-info-dialog.component.scss'],
  template: `
    <div class="dialog-container">
      <div class="dialog-header" mat-dialog-title>
        <span class="title">About User Management</span>
        <button id="CloseButtom" mat-icon-button mat-dialog-close>
          <mat-icon>clear</mat-icon>
        </button>
      </div>
      <mat-dialog-content class="dialog-content">
        <div class="content-body">
          <p class="version-label">Version Number</p>
          <p></p>
          <p class="version-text">{{ version }}</p>
        </div>
      </mat-dialog-content>
    </div>
  `,
})
export class ProductInfoDialogComponent implements OnInit {
  readonly title = `About User Management`;

  version: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data: ProductInformationModel) {}

  ngOnInit() {
    const { version } = this.data;

    this.version = version;
  }
}
