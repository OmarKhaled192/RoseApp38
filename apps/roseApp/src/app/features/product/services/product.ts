import { Injectable } from '@angular/core';
import { ApiService } from '@org/data-access';
import { Product } from '../models/product';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends ApiService<Product> {
  protected override endpoint = 'products';

  constructor( http: HttpClient) {
    super(http);
  }

}
