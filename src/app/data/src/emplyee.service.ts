import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DefaultResponse } from '../../domain/common/default-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly apiURL = environment.API_URL;
  private readonly http = inject(HttpClient);

  list(
    active: boolean = true,
    name: string = '',
    idCard: string = ''
  ): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(`${this.apiURL}/employee/list`);
  }
}
