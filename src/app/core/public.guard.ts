import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TokenService } from '../data/src/token.service';
import { LocalData } from '../data/local/local-data';

@Injectable({
  providedIn: 'root',
})
export class publicGuardService implements CanActivate {
  tokenService: TokenService = inject(TokenService);
  localData: LocalData = inject(LocalData);
  router: Router = inject(Router);

  /**
   * Verifies if the user is logged in, if yes, redirects to /managment
   * @returns {Observable<boolean>} An observable that resolves to true if the
   * user is not logged in, false otherwise.
   */
  canActivate(): Observable<boolean> {
    return this.tokenService
      .validateToken(this.localData.getSimpleToken())
      .pipe(
        take(1),
        map((isAuthenticated) => {
          if (isAuthenticated) {
            this.router.navigate(['/private']);
            return false;
          }
          return true;
        })
      );
  }
}
