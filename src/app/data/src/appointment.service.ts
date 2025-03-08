import { Appointment } from './../../domain/entities/appoitnment';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DefaultResponse } from '../../domain/common/default-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private readonly apiURL = environment.API_URL;
  private readonly http = inject(HttpClient);

  list(
    active: boolean = true,
    name: string = '',
    idCard: string = ''
  ): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(`${this.apiURL}/appointment/list`);
  }

  create(appointment: Appointment): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(
      `${this.apiURL}/appointment/create`,
      appointment
    );
  }
}
