import { ConfirmationDialogComponent, ConfirmationModel, ConfirmationResponse } from './confirmation-dialog.component';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

describe('Confirmation Box Component', () => {
  const mockDialogRef: MatDialogRef<ConfirmationDialogComponent> = {
    close: val => of(val)
  } as any;

  const mockDialogData: ConfirmationModel = {
    title: 'Unit Test',
    message: 'Unit test confirmation',
    okButtonText: 'Unit OK',
    cancelButtonText: 'Unit Cancel'
  };

  const mockFormBuilder: FormBuilder = {
    group: config => ({})
  } as any;

  let component: ConfirmationDialogComponent;

  beforeEach(() => {
    component = new ConfirmationDialogComponent(mockDialogData, mockDialogRef, mockFormBuilder);
  });

  it('should create the dialog component', () => {
    expect(component).toBeTruthy();
  });

  it('should set title, message and button text', () => {
    component.ngOnInit();

    expect(component.title).toBe('Unit Test');
    expect(component.message).toBe('Unit test confirmation');
    expect(component.okButtonText).toBe('Unit OK');
    expect(component.cancelButtonText).toBe('Unit Cancel');
  });

  it('should initialize the notes form', () => {
    spyOn(mockFormBuilder, 'group');

    component.ngOnInit();

    expect(mockFormBuilder.group).toHaveBeenCalled();
  });

  it('should handle cancel click', () => {
    spyOn(mockDialogRef, 'close');

    component.handleCancelClick();

    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });

  it('should handle ok click', () => {
    spyOn(mockDialogRef, 'close');

    const response: ConfirmationResponse = {
      ok: true,
      notes: 'Test notes'
    };

    component.form = { valid: true, value: { notes: 'Test notes' } } as any;
    component.handleOkClick();

    expect(mockDialogRef.close).toHaveBeenCalledWith(response);
  });

  it('should handle notes blur events', () => {
    let valueSet = '[unsetValue]';

    const $event: any = {
      target: {
        value: '    lots of leading and trailing spaces      '
      }
    };

    const form: any = {
      controls: {
        notes: {
          setValue: (val) => valueSet = val
        }
      }
    };

    component.form = form;
    component.handleNotesBlur($event);

    expect(valueSet).toEqual('lots of leading and trailing spaces');
  });
});
