import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SignInRequest } from '../../domain/models/sign-in-request';
import { DefaultResponse } from '../../domain/common/default-response';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../../domain/models/register-request';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly apiURL = environment.API_URL;
  private readonly http = inject(HttpClient);

  validateToken(token: String): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(`${this.apiURL}/token/validate`);
  }
}
