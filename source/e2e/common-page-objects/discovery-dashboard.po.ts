import { waitForElement } from '../utility.po';
import { element, by, ElementArrayFinder } from 'protractor';

export class DiscoveryDashboardPage {
  rows = (): ElementArrayFinder => element.all(by.css('.datatable-row-wrapper'));

  sortMenuItems = (index: number) => element.all(by.css('[mat-menu-item]')).get(index);

  getAddRecommendationButton = () => element(by.id('AddRecommendationButton'));

  getDeleteRecommendationButton = () => element(by.id('DeleteRecommendationButton'));

  isAddRecommendationButtonPresent = () => element(by.id('AddRecommendationButton')).isDisplayed();

  isDeleteRecommendationButtonPresent = () => element(by.id('DeleteRecommendationButton')).isDisplayed();

  getInventoryReductionOpportunity = () => element.all(by.id('InventoryReductions'));

  getExpiringMedicationsOpportunity = () => element.all(by.id('ExpiringMedications'));

  getDataQualityOpportunity = () => element.all(by.id('DataQuality'));

  getMessageElement = () => element(by.css('.message'));

  getLoadingMessageElement = () => element(by.css('.loadingMessage'));

  getSortButton = () => element.all(by.id('sort--button'));

  getModelAddButton = () => element(by.id('addRecommendationButton'));

  getModelDeleteButton = () => element(by.id('deleteRecommendationButton'));

  getInventoryReductionDataTable = () => element(by.css('.datatable-row-wrapper'));

  waitForDialog = () => waitForElement('mat-dialog-container');

  getNotesTextArea = () => element.all(by.id('Notes'));

  isNotesTextAreaPresent = () => element(by.id('Notes')).isPresent();

  addNoteAndSubmit() {
    this.getNotesTextArea()
      .isPresent()
      .then(() => {
        const notesTextArea = this.getNotesTextArea();
        notesTextArea.sendKeys('This is a really long note.');
        this.getModelAddButton()
          .isPresent()
          .then(() => {
            this.getModelAddButton().click();
          });
      });
  }
}
