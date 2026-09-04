import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService, DataResponse } from '@org/data-access';
import { CheckoutSessionStatusPayload } from '../models/payment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentService extends ApiService<string> {
  protected override endpoint = 'payments';

  constructor() {
    super(inject(HttpClient));
  }

  getCheckoutSession(sessionId: string): Observable<DataResponse<CheckoutSessionStatusPayload>> {
    return this.http.get<DataResponse<CheckoutSessionStatusPayload>>(
      `${this.baseUrl}/payments/checkout-session`,
      { params: { session_id: sessionId } },
    );
  }
}
