import {
  ProductInfoDialogComponent,
  ProductInformationModel,
} from '@app/shared/components/product-info-dialog/product-info-dialog.component';

describe('Product Info Dialog', () => {
  const data: ProductInformationModel = {
    version: '1.0.0-unit-test',
  };

  let component: ProductInfoDialogComponent;

  beforeEach(() => {
    component = new ProductInfoDialogComponent(data);
  });

  it('should init with version number', () => {
    expect(component.version).toBeFalsy();
    expect(component.title).toBe('About User Management');

    component.ngOnInit();

    expect(component.version).toBe('1.0.0-unit-test');
  });
});
