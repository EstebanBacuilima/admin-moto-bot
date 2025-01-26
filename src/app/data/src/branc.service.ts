import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DefaultResponse } from '../../domain/common/default-response';
import { Brand } from '../../domain/entities/brand';

@Injectable({
  providedIn: 'root',
})
export class BranService {
  private readonly apiURL = environment.API_URL;
  private readonly http = inject(HttpClient);

  changeState(state: boolean, code: string): Observable<DefaultResponse> {
    return this.http.patch<DefaultResponse>(
      `${this.apiURL}/modify/change-state/${code}`,
      { state }
    );
  }
  create(brand: Brand): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(
      `${this.apiURL}/brand/create`,
      brand
    );
  }

  findByCode(code: string): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(
      `${this.apiURL}/brand/get-by-code/${code}`
    );
  }

  list(): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(`${this.apiURL}/brand/list`);
  }

  update(brand: Brand): Observable<DefaultResponse> {
    return this.http.put<DefaultResponse>(
      `${this.apiURL}/brand/update/${brand.code}`,
      brand
    );
  }
}
