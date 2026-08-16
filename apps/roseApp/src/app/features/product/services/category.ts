import { HttpClient } from '@angular/common/http';
import {inject , Injectable } from '@angular/core';
import { ApiService } from '@org/data-access';
import { ICategory } from '../../home/model/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends ApiService<ICategory> {
  protected override endpoint = 'categories';

  constructor() {
    super(inject(HttpClient));
  }
}
