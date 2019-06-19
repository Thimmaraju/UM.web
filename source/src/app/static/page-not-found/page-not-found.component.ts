import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pc-page-not-found',
  styleUrls: ['./page-not-found.component.scss'],
  template: `
  <div class="background">
    <div class="gradient">
      <div class="container">
        <h1>This is not the page you are looking for</h1>
      </div>
    </div>
  </div>
  `
})
export class PageNotFoundComponent {}
