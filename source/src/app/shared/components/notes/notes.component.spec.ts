import { MatDialogRef } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { NotesComponent } from './notes.component';
import { of } from 'rxjs';

describe('Notes Component', () => {
  const mockDialogRef: MatDialogRef<NotesComponent> = {
    close: val => of(val)
  } as any;

  const mockFormBuilder: FormBuilder = {
    group: config => ({})
  } as any;

  let component: NotesComponent;

  beforeEach(() => {
    component = new NotesComponent(mockFormBuilder, mockDialogRef);
  });
  it('should exist', () => {
    expect(component).toBeTruthy();
  });
  it('on init should init the form', () => {
    spyOn(component, 'initForm');
    component.ngOnInit();
    expect(component.initForm).toHaveBeenCalled();
  });
  it('init form should initialize the form', () => {
    spyOn(mockFormBuilder, 'group');
    component.initForm();
    expect(mockFormBuilder.group).toHaveBeenCalled();
  });
  it('should handle cancel click', () => {
    spyOn(mockDialogRef, 'close');
    component.handleCancelClick();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
  it('should handle the notes blur events', () => {
    let valueSet = '[unsetValue]';
    const $event: any = {
      target: {
        value: '     foo    '
      }
    };
    const form: any = {
      controls: {
        Notes: {
          setValue: val => (valueSet = val)
        }
      }
    };
    component.statusForm = form;
    component.handleNotesBlur($event);
    expect(valueSet).toEqual('foo');
  });
  it('should handle click', () => {
    spyOn(mockDialogRef, 'close');
    component.statusForm = { value: { Notes: 'foo bar' } } as any;
    component.handleClick();
    expect(mockDialogRef.close).toHaveBeenCalledWith('foo bar');
  });
});
