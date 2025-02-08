import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DefaultResponse } from '../../domain/common/default-response';
import { MotorcycleIssue } from '../../domain/entities/motorcycle_issue';

@Injectable({
    providedIn: 'root',
})
export class MotorcycleIssueService {
    private readonly apiURL = environment.API_URL;
    private readonly http = inject(HttpClient);

    private readonly typePath = "motorcycle-issue";

    changeState(state: boolean, code: string): Observable<DefaultResponse> {
        return this.http.patch<DefaultResponse>(
            `${this.apiURL}/${this.typePath}/modify/change-state/${code}`,
            { state }
        );
    }
    create(motorcycleIssue: MotorcycleIssue): Observable<DefaultResponse> {
        return this.http.post<DefaultResponse>(
            `${this.apiURL}/${this.typePath}/create`,
            motorcycleIssue
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

    update(motorcycleIssue: MotorcycleIssue): Observable<DefaultResponse> {
        return this.http.put<DefaultResponse>(
            `${this.apiURL}/${this.typePath}/update/${motorcycleIssue.code}`,
            motorcycleIssue
        );
    }
}
