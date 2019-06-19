import { AbstractControl } from '@angular/forms';

export class ItemModificationValidators {

  static checkAllLevels(control: AbstractControl) {
    const criticalLevel = control.get('CriticalLevel');
    const reorderLevel = control.get('ReorderLevel');
    const maxLevel = control.get('MaxLevel');

    if (!(criticalLevel && reorderLevel && maxLevel)) {
      return null;
    }

    const criticalLevelValue = +criticalLevel.value;
    const reorderLevelValue = +reorderLevel.value;
    const maxLevelValue = +maxLevel.value;

    if (criticalLevelValue >= 0 && reorderLevelValue > 0 && maxLevelValue > 0 &&
      (criticalLevelValue > reorderLevelValue) ||
      (reorderLevelValue > maxLevelValue) ||
      (criticalLevelValue > maxLevelValue)) {
      return { invalidReorderLevel: true };
    } else {
      return null;
    }

  }

}
