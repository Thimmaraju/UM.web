import { element, by } from 'protractor';

export class RecommendationPage {
  getInventoryReductionRecommendation = () => element(by.id('inventoryReductionRecommendation'));

  getMessageElement = () => element(by.css('.message'));

  getViewButton = () => element(by.id('ViewInventoryReduction'));

  getApplyChangeButton = () => element(by.id('ApplyChangeInventoryReduction'));

  getRecommendationPanel = () => element(by.css('.high-five-list-header'));

  getNotesField = () => element(by.id('Notes'));

  getSubmitButton = () => element(by.id('SubmitChange'));

  getProgressIndicator = () => element(by.css('mat-card'));
}
