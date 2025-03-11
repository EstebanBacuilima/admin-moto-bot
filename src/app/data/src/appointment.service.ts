import { Appointment } from './../../domain/entities/appoitnment';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DefaultResponse } from '../../domain/common/default-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private readonly apiURL = environment.API_URL;
  private readonly http = inject(HttpClient);

  list(
    date: Date = new Date(),
    customerIdCard: string = '',
    employeeIdCard: string = ''
  ): Observable<DefaultResponse> {
    let params = new HttpParams()
      .set('customer-id-card', customerIdCard)
      .set('employee-id-card', employeeIdCard);
    return this.http.get<DefaultResponse>(`${this.apiURL}/appointment/list`, {
      params,
    });
  }

  create(appointment: Appointment): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(
      `${this.apiURL}/appointment/create`,
      appointment
    );
  }

  updateState(appointment: Appointment): Observable<DefaultResponse> {
    return this.http.put<DefaultResponse>(
      `${this.apiURL}/appointment/update-state/${appointment.code}`,
      appointment
    );
  }

  serviceReport(): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(
      `${this.apiURL}/appointment/list/most-used-services`
    );
  }

  establishmentReport(): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(
      `${this.apiURL}/appointment/list/most-used-establishments`
    );
  }

  appoinmentReport(): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(
      `${this.apiURL}/appointment/list/chart-state`
    );
  }
}
