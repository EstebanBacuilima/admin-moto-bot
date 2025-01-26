import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DefaultResponse } from '../../domain/common/default-response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiURL = environment.API_URL;
  private readonly http = inject(HttpClient);

  private readonly typePath = "product";

  list(): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(`${this.apiURL}/${this.typePath}/list`);
  }

  listByCategoryId(id: number): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(`${this.apiURL}/${this.typePath}/list`);
  }
}
