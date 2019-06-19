import { Component } from '@angular/core';
import { environment as env } from '@env/environment';

@Component({
  selector: 'pc-footer',
  styleUrls: ['footer.component.scss'],
  template: `
  <footer id="AppFooter">
    <div fxLayout="row" fxLayoutAlign="center center">
      Version {{version}}
    </div>
  </footer>
  `
})
export class FooterComponent {
  version = env.version.app;
}
