import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DefaultResponse } from '../../domain/common/default-response';
import { RegisterRequest } from '../../domain/models/register-request';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiURL = environment.API_URL;
  private readonly http = inject(HttpClient);

  list(email: string): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(`${this.apiURL}/user/list`);
  }

  update(request: RegisterRequest): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(
      `${this.apiURL}/user/update/${request.code}`,
      request
    );
  }
}
