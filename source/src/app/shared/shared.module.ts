import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';
import {
  GridModule,
  ButtonToggleModule,
  ButtonActionModule,
  SearchModule,
  InputsModule,
  ToastModule,
  PopupDialogModule,
  PopupWindowModule,
  FooterModule,
  SvgIconModule,
  NavbarModule,
  RadioButtonModule,
  PopupDialogService,
  ToastService,
  PopupWindowService,
} from 'webcorecomponent-lib';
import { MatNativeDateModule, MatRippleModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { ObserversModule } from '@angular/cdk/observers';
import { PortalModule } from '@angular/cdk/portal';

// components
import { MessageComponent } from './components/message/message.component';
import { NotesComponent } from './components/notes/notes.component';

import { LoginHeaderComponent } from './components/header/login-header.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ProductInfoDialogComponent } from './components/product-info-dialog/product-info-dialog.component';

import { TabHeaderComponent } from './components/tab-header/tab-header.component';
import { TabInfoComponent } from './components/tab-info/tab-info.component';
import { FooterComponent } from './components/footer/footer.component';

// directives
import { PcMessageContainerDirective } from './components/message/message.component';

// pipes
import { OrderByDateDescPipe } from './pipes/orderbyDateDesc.pipe';
import { DeaClassPipe } from './pipes/deaClass.pipe';
import { RoundDownPipe } from './pipes/roundDown.pipe';
import { SplitProperCase } from './pipes/splitProperCase.pipe';
import { NotApplicablePipe } from './pipes/not-applicable-pipe/not-applicable.pipe';
import { TrimPipe } from './pipes/trim.pipe';

// services
import { SHARED_SERVICES } from './index';

@NgModule({
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatTableModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatNativeDateModule,
    CdkTableModule,
    A11yModule,
    BidiModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    NgxDatatableModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    ButtonToggleModule,
    ButtonActionModule,
    SearchModule,
    InputsModule,
    ToastModule,
    PopupDialogModule,
    PopupWindowModule,
    FooterModule,
    SvgIconModule,
    NavbarModule,
    RadioButtonModule,
  ],
  declarations: [
    MessageComponent,
    NotesComponent,

    PcMessageContainerDirective,
    OrderByDateDescPipe,
    DeaClassPipe,
    RoundDownPipe,
    SplitProperCase,

    LoginHeaderComponent,
    FooterComponent,
    NotApplicablePipe,
    ConfirmationDialogComponent,
    ProductInfoDialogComponent,

    TabHeaderComponent,
    TabInfoComponent,
    TrimPipe,
  ],
  exports: [
    CommonModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatTableModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatNativeDateModule,
    CdkTableModule,
    NgxDatatableModule,
    OrderByDateDescPipe,
    DeaClassPipe,
    FlexLayoutModule,
    MessageComponent,
    PcMessageContainerDirective,
    RoundDownPipe,
    SplitProperCase,
    NotesComponent,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    ButtonToggleModule,
    ButtonActionModule,
    SearchModule,
    InputsModule,
    ToastModule,
    PopupDialogModule,
    PopupWindowModule,
    FooterModule,
    SvgIconModule,
    NavbarModule,
    RadioButtonModule,

    LoginHeaderComponent,
    FooterComponent,
    NotApplicablePipe,
    TabHeaderComponent,
    TabInfoComponent,
    TrimPipe,
  ],
  providers: [ToastService, PopupDialogService, PopupWindowService],
  entryComponents: [ConfirmationDialogComponent, ProductInfoDialogComponent],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [...SHARED_SERVICES],
    };
  }
}
