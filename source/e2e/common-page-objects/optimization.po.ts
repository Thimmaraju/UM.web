import { browser, element, by, $, $$, ElementFinder, ElementHelper } from 'protractor';
import './opportunityAccordion.po';
import { OpportunityAccordionComponent } from './opportunityAccordion.po';

export class OptimizationPage {
  getIROpportunities = () => $$('#InventoryReductionItemContainer');
  getEMOpportunities = () => $$('#ExpiringMedicationItemContainer');
  getFirstIR = () => new OpportunityAccordionComponent($('#InventoryReductionItemContainer'));

  addNoteForm = () => $('#NewOpportunityForm');
  addNoteCancelButton = () => $('#CancelButton');
  addNoteConfirmButtom = () => $('#AddRecommendationButton');
  closeAddNote = () => {
    this.addNoteCancelButton().sendKeys('\n');
    browser.sleep(1000);
  }
}
