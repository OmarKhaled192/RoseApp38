import { inject, Injectable } from '@angular/core';
import { ApiService } from '@org/data-access';
import { Order } from '../models/order';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  OrderMetadata,
  OrdersPayload,
} from '../../orders-list/interfaces/order-items';
import { environment } from '@org/environments';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends ApiService<Order> {
  protected override endpoint = 'orders';

  getAllOrders(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/orders`);
  }

  constructor() {
    super(inject(HttpClient));
  }
}
