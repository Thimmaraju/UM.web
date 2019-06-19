import { ToasterService, NotesService, DateService } from '@app/shared';
import {
  ToastService,
  PopupWindowService,
  IPopupWindowContainer,
  PopupWindowProperties,
  PopupDialogProperties,
  PopupDialogType,
  PopupDialogService,
} from 'webcorecomponent-lib';
import { RoundDownPipe } from '@app/shared/pipes/roundDown.pipe';

export * from './shared.module';

// services
export * from './service/toaster.service';

export * from './service/notes.service';

export * from './service/date.service';
export {
  ToastService,
  PopupWindowService,
  PopupWindowProperties,
  PopupDialogProperties,
  PopupDialogType,
  PopupDialogService,
  IPopupWindowContainer,
} from 'webcorecomponent-lib';

export const SHARED_SERVICES = [
  { provide: ToasterService, useClass: ToasterService },
  { provide: NotesService, useClass: NotesService },
  { provide: DateService, useClass: DateService },
  { provide: RoundDownPipe, useClass: RoundDownPipe },
  { provide: ToastService, useClass: ToastService },
  { provide: PopupWindowService, useClass: PopupWindowService },
  { provide: PopupDialogService, useClass: PopupDialogService },
];

// models
export * from './models/note.interface';
export * from './models/note.interface';

// components
export { SearchBoxComponent } from 'webcorecomponent-lib';
export * from './components/message/message.component';
export * from './components/notes/notes.component';

// validators
export * from './validators/itemmodification.validators';
