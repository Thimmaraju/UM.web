import { Injectable } from '@angular/core';
import { format, max, isDate, parse, getYear } from 'date-fns';

@Injectable()
export class DateService {

  constructor() { }

  determineGeneratedOnDttm(expiringMedicationDttm?: Date, inventoryReductionDttm?: Date): string {
    const expiringMedGeneratedDttm = expiringMedicationDttm ? parse(expiringMedicationDttm) : expiringMedicationDttm;
    const inventoryRedGeneratedDttm = inventoryReductionDttm ? parse(inventoryReductionDttm) : inventoryReductionDttm;
    if (!isDate(expiringMedGeneratedDttm) && !isDate(inventoryRedGeneratedDttm)) {
      return '';
    } else {
      const maxDate = max(expiringMedGeneratedDttm, inventoryRedGeneratedDttm);
      return getYear(maxDate) === 0o0 ? '' : format(maxDate, 'MM/DD/YYYY hh:mm A');
    }
  }
}
