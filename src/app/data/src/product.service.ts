import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DefaultResponse } from '../../domain/common/default-response';
import { Product } from '../../domain/entities/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiURL = environment.API_URL;
  private readonly http = inject(HttpClient);

  private readonly typePath = 'product';

  changeState(state: boolean, code: string): Observable<DefaultResponse> {
    return this.http.patch<DefaultResponse>(
      `${this.apiURL}/${this.typePath}/modify/change-state/${code}`,
      { state }
    );
  }

  create(product: Product): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(
      `${this.apiURL}/${this.typePath}/create`,
      product
    );
  }

  findByCode(code: string): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(
      `${this.apiURL}/${this.typePath}/find/by-code/${code}`
    );
  }

  update(product: Product): Observable<DefaultResponse> {
    return this.http.put<DefaultResponse>(
      `${this.apiURL}/${this.typePath}/update/${product.code}`,
      product
    );
  }

  list(): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(
      `${this.apiURL}/${this.typePath}/list`
    );
  }
  listAll(): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(
      `${this.apiURL}/${this.typePath}/list-all`
    );
  }

  listByCategoryId(id: number): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(
      `${this.apiURL}/${this.typePath}/list`
    );
  }
}
