import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DefaultResponse } from '../../domain/common/default-response';
import { Service } from '../../domain/entities/service';

@Injectable({
    providedIn: 'root',
})
export class ServiceService {
    private readonly apiURL = environment.API_URL;
    private readonly http = inject(HttpClient);

    private readonly typePath = "service";

    changeState(state: boolean, code: string): Observable<DefaultResponse> {
        return this.http.patch<DefaultResponse>(
            `${this.apiURL}/${this.typePath}/modify/change-state/${code}`,
            { state }
        );
    }
    create(service: Service): Observable<DefaultResponse> {
        return this.http.post<DefaultResponse>(
            `${this.apiURL}/${this.typePath}/create`,
            service
        );
    }

    findByCode(code: string): Observable<DefaultResponse> {
        return this.http.get<DefaultResponse>(
            `${this.apiURL}/${this.typePath}/get-by-code/${code}`
        );
    }

    list(value?: string): Observable<DefaultResponse> {
        return this.http.get<DefaultResponse>(`${this.apiURL}/${this.typePath}/list?value=${value}`);
    }

    listActive(value?: string): Observable<DefaultResponse> {
        value = value ? value : '';
        return this.http.get<DefaultResponse>(`${this.apiURL}/${this.typePath}/list-active?value=${value}`);
    }

    update(service: Service): Observable<DefaultResponse> {
        return this.http.put<DefaultResponse>(
            `${this.apiURL}/${this.typePath}/update/${service.code}`,
            service
        );
    }
}
