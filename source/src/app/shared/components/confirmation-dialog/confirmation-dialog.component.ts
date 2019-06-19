import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface ConfirmationModel {
  title?: string;
  message?: string;
  helpText?: string;
  okButtonText?: string;
  cancelButtonText?: string;
}

export interface ConfirmationResponse {
  ok: boolean;
  notes?: string;
}

@Component({
  selector: 'pc-confirmation-dialog',
  styleUrls: ['./confirmation-dialog.component.scss'],
  template: `
    <div id="ConfirmationDialogContainer" class="dialog-container">
      <div class="dialog-header" mat-dialog-title>
        <span class="title">Complete Opportunity</span>
        <button id="CloseButton" mat-icon-button mat-dialog-close>
          <mat-icon>clear</mat-icon>
        </button>
      </div>
      <mat-dialog-content class="dialog-content">
        <div class="content-body">
          <span>{{message}}</span>
        </div>
        <div class="notes">
          <form id="ConfirmationDialogForm" [formGroup]="form">
            <mat-form-field class="full-width">
              <label for="notes">Notes:</label>
              <textarea class="text-input" matInput id="notes" formControlName="notes" rows="5" (blur)="handleNotesBlur($event)"></textarea>
              <mat-error *ngIf="form.invalid">
                Notes must be between 10 and 500 characters long
              </mat-error>
            </mat-form-field>
          </form>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button id="CancelButton" mat-raised-button color="primary" (click)="handleCancelClick()">{{cancelButtonText | uppercase}}</button>
        <button id="OkButton" mat-raised-button color="accent" (click)="handleOkClick()" [disabled]="form.invalid">{{okButtonText | uppercase}}</button>
      </mat-dialog-actions>
    </div>
  `
})
export class ConfirmationDialogComponent implements OnInit {
  form: FormGroup;
  title: string;
  message: string;
  okButtonText: string;
  cancelButtonText: string;

  notes: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ConfirmationModel,
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    const { title, message, okButtonText, cancelButtonText } = this.data;

    this.title = title;
    this.message = message;
    this.okButtonText = okButtonText;
    this.cancelButtonText = cancelButtonText;

    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      notes: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  handleNotesBlur($event: FocusEvent): void {
    const { value } = ($event.target as HTMLTextAreaElement);

    this.form.controls.notes.setValue(value.trim());
  }

  handleCancelClick(): void {
    this.dialogRef.close(null);
  }

  handleOkClick(): void {
    if (this.form.valid) {
      const resp: ConfirmationResponse = {
        ok: true,
        notes: this.form.value.notes
      };

      this.dialogRef.close(resp);
    }
  }
}
