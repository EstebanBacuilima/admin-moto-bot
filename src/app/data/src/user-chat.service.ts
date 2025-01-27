import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DefaultResponse } from '../../domain/common/default-response';
import { Observable } from 'rxjs';
import { UserQueryRequestDto } from '../../domain/models/user-query-request-dto';

@Injectable({
  providedIn: 'root',
})
export class UserChatService {
  private readonly apiURL = environment.API_URL;
  private readonly http = inject(HttpClient);
  private readonly typePath = 'user-chat';

  createUserQuey(request: UserQueryRequestDto): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(
      `${this.apiURL}/${this.typePath}/user-query`,
      request
    );
  }

  listByUser(): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(
      `${this.apiURL}/${this.typePath}/list/by-user`
    );
  }

  findByCode(code: string): Observable<DefaultResponse> {
    return this.http.get<DefaultResponse>(
      `${this.apiURL}/${this.typePath}/find/by-code/${code}`
    );
  }
}
