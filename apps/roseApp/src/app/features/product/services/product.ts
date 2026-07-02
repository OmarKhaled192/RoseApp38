import { Injectable } from '@angular/core';
import { ApiService } from '@org/data-access';
import { Product, ProductData } from '../models/product';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends ApiService<ProductData> {
  protected override endpoint = 'products';

  constructor( http: HttpClient) {
    super(http);
  }

    getProductDetail(id: string) {
    return this.getResourceById<Product>(id);
  }

}
