import {CanActivate, CanActivateFn, Router} from '@angular/router';
import {catchError, map, Observable, of} from 'rxjs';
import {AuthService} from '../core/services/auth.service';

export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map(isAuth => {
        if (isAuth) return true;
        this.router.navigate(['/login']);
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false)
      })
    )

  }

}
