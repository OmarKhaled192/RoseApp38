import { inject, Injectable } from '@angular/core';
import { ApiService } from '@org/data-access';
import { Order } from '../models/order';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends ApiService<Order> {
  protected override endpoint = 'order';

  constructor() {
    super(inject(HttpClient));
  }
}
