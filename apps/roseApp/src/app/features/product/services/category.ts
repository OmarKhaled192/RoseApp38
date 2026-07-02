import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Category {
  HttpClient = inject(HttpClient);


  getCategories(page:number, limit:number):Observable<any> {
    return this.HttpClient.get(`https://rose-app.elevate-bootcamp.cloud/api/categories?page=${page}&limit=${limit}`);
  }
}
