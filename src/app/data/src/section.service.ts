import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DefaultResponse } from '../../domain/common/default-response';
import { Section } from '../../domain/entities/section';

@Injectable({
    providedIn: 'root',
})
export class SectionService {
    private readonly apiURL = environment.API_URL;
    private readonly http = inject(HttpClient);

    private readonly typePath = "section";

    changeState(state: boolean, code: string): Observable<DefaultResponse> {
        return this.http.patch<DefaultResponse>(
            `${this.apiURL}/${this.typePath}/modify/change-state/${code}`,
            state
        );
    }
    create(section: Section): Observable<DefaultResponse> {
        return this.http.post<DefaultResponse>(
            `${this.apiURL}/${this.typePath}/create`,
            section
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

    listIncludingProduct(): Observable<DefaultResponse> {
        return this.http.get<DefaultResponse>(`${this.apiURL}/${this.typePath}/list/including-product`);
    }

    update(section: Section): Observable<DefaultResponse> {
        return this.http.put<DefaultResponse>(
            `${this.apiURL}/${this.typePath}/update/${section.code}`,
            section
        );
    }

    productCountById(id: number): Observable<DefaultResponse> {
        return this.http.get<DefaultResponse>(
            `${this.apiURL}/${this.typePath}/count/product-by-id/${id}`
        );
    }
}
