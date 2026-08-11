import { Injectable } from '@angular/core';
import { ApiService } from '@org/data-access';
import { HttpClient } from '@angular/common/http';
import { Product, ProductData } from '@org/ui';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends ApiService<ProductData> {
  protected override endpoint = 'products';

  constructor(http: HttpClient) {
    super(http);
  }

  getProductDetail(id: () => string) {
    return this.getResourceById<Product>(id);
  }


}
