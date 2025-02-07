import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponse } from '../../domain/common/default-response';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private readonly apiURL = environment.API_URL;

  http = inject(HttpClient);
  private path = 'file';

  uploadFiles(fileList: any[]): Observable<DefaultResponse> {
    const formData = new FormData();
    fileList.forEach((file: any) => {
      formData.append('file', file, file.path);
    });
    return this.http.post<DefaultResponse>(
      `${this.apiURL}/file/bulk-create`,
      formData
    );
  }
}
