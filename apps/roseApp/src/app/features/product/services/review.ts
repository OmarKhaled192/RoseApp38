import { inject, Injectable } from '@angular/core';
import { ApiService } from '@org/data-access';
import { HttpClient } from '@angular/common/http';
import { Review } from '@org/ui';

@Injectable({
  providedIn: 'root',
})
export class ReviewService extends ApiService<Review> {
  protected override endpoint = 'reviews';

  constructor() {
    super(inject(HttpClient));
  }

}
