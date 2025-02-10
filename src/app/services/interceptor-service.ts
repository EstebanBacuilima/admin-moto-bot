import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  catchError,
  finalize,
  from,
  Observable,
  switchMap,
  throwError,
} from 'rxjs';
import { LocalData } from '../data/local/local-data';
import { AuthService } from './../data/src/auth.service';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  private readonly localData = inject(LocalData);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.localData.getToken()).pipe(
      switchMap((jwtToken: string | null) => {
        const token = jwtToken ?? '';
        const headers: any = {
          Authorization: token,
        };

        if (request.headers.has('Content-Type')) {
          headers['Content-Type'] = request.headers.get('Content-Type') ?? '';
        }

        const clonedRequest = request.clone({ setHeaders: headers });

        return next.handle(clonedRequest).pipe(
          catchError((error) => {
            if (error instanceof HttpErrorResponse) {
              this.manageError(error);
            }
            return throwError(() => error);
          }),
          finalize(() => { })
        );
      })
    );
  }

  private manageError(error: HttpErrorResponse): void {
    switch (error.status) {
      case 0:
        this.authService.signOut();
        this.router.navigate(['/public/sign-in']);
        break;
      case 401:
        this.authService.signOut();
        this.router.navigate(['/public/sign-in']);
        break;
      case 500:
        if (
          error.error.message.includes('ID token must not be null or empty')
        ) {
          this.authService.signOut();
          this.router.navigate(['/public/sign-in']);
        }
        break;
    }
    if (error.status !== 0) {
      this.message.error(this.parseError(error.error.message));
    }
  }

  private parseError(errorCode: string): string {
    if (errorCode.includes('duplicate-unique-constraint')) {
      return 'Ya existe un registro: ' + errorCode.split('-').pop();
    }
    const data: { [key: string]: string } = {
      'name-is-already-exists': 'El nombre ya existe',
      'user-not-found': 'Usuario no encontrado',
      'wrong-password': 'Contraseña incorrecta',
      'insecure-password': 'Contraseña insegura',
      'invalid-name': 'Nombre no válido',
      'email-not-found': 'Correo electronico no encontrado',
      'invalid-description': 'Descripción incorrecta',
      'invalid-password-length': 'La contraseña debe tener mínimo 8 caracteres',
      'email-in-use-by-another-person':
        'El email ingresado esta siendo usado por otra persona',
      'phone-number-in-use-by-another-person':
        'El número de telefono ingresado esta siendo usado por otra persona',
      'attribute-already-exists': 'Atributo ya existe',
      forbidden: 'Prohibido',
      unauthorized: 'No autorizado',
    };
    return data[errorCode] ?? errorCode;
  }
}
