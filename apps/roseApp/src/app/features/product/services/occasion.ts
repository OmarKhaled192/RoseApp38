import { Injectable } from '@angular/core';
import { ApiService } from '@org/data-access';
import { IOccasion } from '../../products/models/products.models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Occasion  extends ApiService<IOccasion> {

  protected override endpoint = 'occasions';

  constructor(http: HttpClient) {
    super(http);
  }
}
