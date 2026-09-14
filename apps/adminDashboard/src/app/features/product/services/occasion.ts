import {inject, Injectable } from '@angular/core';
import { ApiService } from '@org/data-access';
import { HttpClient } from '@angular/common/http';
import { IOccasion } from '../models/products.models';

@Injectable({
  providedIn: 'root',
})
export class Occasion  extends ApiService<IOccasion> {

  protected override endpoint = 'occasions';

  constructor() {
    super(inject(HttpClient));
  }
}
