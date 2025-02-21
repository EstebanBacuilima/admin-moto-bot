import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DefaultResponse } from '../../domain/common/default-response';
import { Establishment } from '../../domain/entities/establishment';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentService {
  private readonly apiURL = environment.API_URL;
  private readonly http = inject(HttpClient);

  private readonly typePath = "establishment";

  changeState(state: boolean, code: string): Observable<DefaultResponse> {
    return this.http.patch<DefaultResponse>(
      `${this.apiURL}/${this.typePath}/modify/change-state/${code}`,
      state
    );
  }
  create(establishment: Establishment): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(
      `${this.apiURL}/${this.typePath}/create`,
      establishment
    );
  }

  findByCode(code: string): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(
      `${this.apiURL}/${this.typePath}/get-by-code/${code}`
    );
  }

  list(): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(`${this.apiURL}/${this.typePath}/list`);
  }

  update(establishment: Establishment): Observable<DefaultResponse> {
    return this.http.put<DefaultResponse>(
      `${this.apiURL}/${this.typePath}/update/${establishment.code}`,
      establishment
    );
  }
}
