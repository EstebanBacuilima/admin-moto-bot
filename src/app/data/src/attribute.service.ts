import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DefaultResponse } from '../../domain/common/default-response';
import { Attribute } from '../../domain/entities/attribute';

@Injectable({
    providedIn: 'root',
})
export class AttributeService {
    private readonly apiURL = environment.API_URL;
    private readonly http = inject(HttpClient);

    private readonly typePath = "attribute";

    changeState(state: boolean, code: string): Observable<DefaultResponse> {
        return this.http.patch<DefaultResponse>(
            `${this.apiURL}/${this.typePath}/modify/change-state/${code}`,
            state
        );
    }
    create(attribute: Attribute): Observable<DefaultResponse> {
        return this.http.post<DefaultResponse>(
            `${this.apiURL}/${this.typePath}/create`,
            attribute
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

    update(attribute: Attribute): Observable<DefaultResponse> {
        return this.http.put<DefaultResponse>(
            `${this.apiURL}/${this.typePath}/update/${attribute.code}`,
            attribute
        );
    }
}
