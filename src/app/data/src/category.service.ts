import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DefaultResponse } from '../../domain/common/default-response';
import { Category } from '../../domain/entities/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiURL = environment.API_URL;
  private readonly http = inject(HttpClient);

  changeState(state: boolean, code: string): Observable<DefaultResponse> {
    return this.http.patch<DefaultResponse>(
      `${this.apiURL}/category/modify/change-state/${code}`,
      { state }
    );
  }
  create(category: Category): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(
      `${this.apiURL}/category/create`,
      category
    );
  }

  findByCode(code: string): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(
      `${this.apiURL}/category/get-by-code/${code}`
    );
  }

  list(): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(`${this.apiURL}/category/list`);
  }

  update(category: Category): Observable<DefaultResponse> {
    return this.http.put<DefaultResponse>(
      `${this.apiURL}/category/update/${category.code}`,
      category
    );
  }
}
