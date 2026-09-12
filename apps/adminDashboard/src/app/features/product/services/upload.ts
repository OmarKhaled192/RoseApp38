import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService } from '@org/data-access';

@Injectable({
  providedIn: 'root',
})
export class UploadService extends ApiService<string> {
  protected override endpoint = 'upload';

  constructor() {
    super(inject(HttpClient));
  }

}

