import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '@org/data-access';

@Injectable({ providedIn: 'root' })
export class PaymentService extends ApiService<string> {
  protected override endpoint = 'payments';

  constructor() {
    super(inject(HttpClient));
  }
}
