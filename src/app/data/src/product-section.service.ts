import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DefaultResponse } from '../../domain/common/default-response';

@Injectable({
    providedIn: 'root',
})
export class ProductSectionService {
    private readonly apiURL = environment.API_URL;
    private readonly http = inject(HttpClient);

    private readonly typePath = "product-section";

    bulkCreate(productIds: number[], sectionId: number): Observable<DefaultResponse> {
        return this.http.post<DefaultResponse>(
            `${this.apiURL}/${this.typePath}/bulk-create?section_id=${sectionId}`,
            productIds
        );
    }

    list(value?: string): Observable<DefaultResponse> {
        return this.http.get<DefaultResponse>(`${this.apiURL}/${this.typePath}/list`);
    }

    listProductIdsBySection(sectionId: number): Observable<DefaultResponse> {
        return this.http.get<DefaultResponse>(`${this.apiURL}/${this.typePath}/list/product-ids-by-section?section_id=${sectionId}`);
    }
}
