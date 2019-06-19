import { Component, Input, Output, Renderer2, ElementRef, Directive, ViewContainerRef,
        ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Directive({
  selector: '[pcMessageContainer]'
})
export class PcMessageContainerDirective {
  constructor(public viewContainer: ViewContainerRef) {}
}

@Component({
  selector: 'pc-message',
  styleUrls: ['message.component.scss'],
  template: `
    <div pcMessageContainer></div>
    <ng-template >
      <div [id]="'PcMessage' + (icon | titlecase | trim: true)" class="message-wrapper">
        <mat-icon class="message-icon">{{icon}}</mat-icon>
        <div class="message-labels">
          <div class="message-label">{{label}}</div>
          <div class="message-sublabel">{{sublabel}}</div>
          <div class="message-helptext" *ngIf="helptext">{{helptext}}</div>
        </div>
        <ng-content select="[message-actions]"></ng-content>
      </div>
    </ng-template>
  `
})
export class MessageComponent implements AfterViewInit {
  private _color: string;

  @ViewChild(PcMessageContainerDirective) _childElement: PcMessageContainerDirective;
  @ViewChild(TemplateRef) _template: TemplateRef<any>;

  @Input('label') label: string;

  @Input('sublabel') sublabel: string;

  @Input() helptext: string;

  @Input('icon') icon: string;

  @Input('color')
  set color(color: string) {
    if (color === 'primary' || color === 'accent' || color === 'warn') {
      this._render.addClass(this._elementRef.nativeElement, 'pc-' + color);
    }
    this._color = color;
    this._changeDetectorRef.markForCheck();
  }
  get color (): string {
    return this._color;
  }

  constructor(private _render: Renderer2,
              private _elementRef: ElementRef,
              private _changeDetectorRef: ChangeDetectorRef) {
    this._render.addClass(this._elementRef.nativeElement, 'message');
  }

  ngAfterViewInit(): void {
    Promise.resolve(undefined).then(() => {
      this._childElement.viewContainer.createEmbeddedView(this._template);
      this._changeDetectorRef.markForCheck();
    });
  }

}

