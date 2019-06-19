import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'pc-notes',
  styleUrls: ['notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="new-opportunity-toolbar" mat-dialog-title>
      <span style="color:white">Add Note</span>
      <button id="CloseButton" mat-icon-button mat-dialog-close>
        <mat-icon>clear</mat-icon>
      </button>
    </div>
    <form id="NewOpportunityForm" [formGroup]="statusForm">
      <mat-dialog-content class="new-opportunity-content">
        <mat-form-field class="full-width body-input">
          <textarea matInput style="font-size: 1.3rem;" id="Notes" formControlName="Notes" rows="5" (blur)="handleNotesBlur($event)"></textarea>
        </mat-form-field>
        <mat-error *ngIf="statusForm.invalid && (statusForm.dirty || statusForm.touched)">
          Notes must be between 10 and 500 characters long
        </mat-error>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button id="CancelButton" mat-raised-button color="primary" (click)="handleCancelClick()">CANCEL</button>
        <button id="AddRecommendationButton" type="button" mat-raised-button (click)="handleClick()" color="accent"
          [disabled]="statusForm.invalid">
          ADD
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class NotesComponent implements OnInit {
  statusForm: any;

  constructor(private _formBuilder: FormBuilder, private _dialogRef: MatDialogRef<NotesComponent>) {}

  handleClick(): void {
    this._dialogRef.close(this.statusForm.value.Notes);
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.statusForm = this._formBuilder.group({
      Notes: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  handleCancelClick(): void {
    this._dialogRef.close();
  }

  handleNotesBlur($event: FocusEvent): void {
    const { value } = $event.target as HTMLTextAreaElement;
    this.statusForm.controls.Notes.setValue(value.trim());
  }
}
