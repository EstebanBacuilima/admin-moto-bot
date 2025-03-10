import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DefaultResponse } from '../../domain/common/default-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiURL = environment.API_URL;
  private readonly http = inject(HttpClient);

  list(email: string): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(`${this.apiURL}/user/list`);
  }
}
