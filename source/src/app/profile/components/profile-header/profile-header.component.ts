import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pc-profile-header',
  styleUrls: ['profile-header.component.scss'],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          <h3><mat-icon>person</mat-icon> {{ username }}</h3>
        </mat-card-title>
        <mat-card-subtitle>{{ email }}</mat-card-subtitle>
        <mat-card-subtitle>{{ userRole }}</mat-card-subtitle>
      </mat-card-header>
    </mat-card>
  `
})
export class ProfileHeaderComponent {
  constructor() { }
  @Input()
  username: string;
  @Input()
  email: string;
  @Input()
  userRole: string;
}
