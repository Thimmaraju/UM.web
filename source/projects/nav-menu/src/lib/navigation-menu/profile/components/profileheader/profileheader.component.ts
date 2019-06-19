import { Component, Input } from '@angular/core';

@Component({
  selector: 'pc-profileheader',
  styleUrls: ['./profileheader.component.scss'],
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
  `,
})
export class ProfileheaderComponent {
  constructor() { }
  @Input()
  username: string;
  @Input()
  email: string;
  @Input()
  userRole: string;
}
