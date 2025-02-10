import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DefaultResponse } from '../../domain/common/default-response';
import { ProductAttribute } from '../../domain/entities/product_attribute';

@Injectable({
    providedIn: 'root',
})
export class ProductAttributeService {
    private readonly apiURL = environment.API_URL;
    private readonly http = inject(HttpClient);

    private readonly typePath = "product-attribute";

    changeState(state: boolean, productId: number, attributeId: number): Observable<DefaultResponse> {
        return this.http.patch<DefaultResponse>(
            `${this.apiURL}/${this.typePath}/modify/change-state/?pro_id=${productId}&att_id=${attributeId}`,
            state
        );
    }
    create(productAttribute: ProductAttribute): Observable<DefaultResponse> {
        return this.http.post<DefaultResponse>(
            `${this.apiURL}/${this.typePath}/create`,
            productAttribute
        );
    }

    findByProductAndAttributeCode(productId: number, attributeId: number): Observable<DefaultResponse> {
        return this.http.get<DefaultResponse>(
            `${this.apiURL}/${this.typePath}/find/by-product-and-attribute?pro_id=${productId}&att_id=${attributeId}`
        );
    }

    listByProduct(productId: number, value?: string): Observable<DefaultResponse> {
        value = value ? value : '';
        return this.http.get<DefaultResponse>(`${this.apiURL}/${this.typePath}/list-by-product?id=${productId}&value=${value}`);
    }

    update(productAttribute: ProductAttribute): Observable<DefaultResponse> {
        return this.http.put<DefaultResponse>(
            `${this.apiURL}/${this.typePath}/update`,
            productAttribute
        );
    }
}
