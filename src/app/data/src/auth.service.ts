import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SignInRequest } from '../../domain/models/sign-in-request';
import { DefaultResponse } from '../../domain/common/default-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiURL = environment.API_URL;
  private readonly http = inject(HttpClient);

  authenticate(request: SignInRequest): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(
      `${this.apiURL}/auth/login`,
      request
    );
  }

  signOut(): void {
    localStorage.clear();
  }
}
