import { inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class usercabinetCanloadGuard implements CanActivate, CanActivateChild, CanLoad {

  private authService = inject(AuthService);

  canActivate( ): Observable<boolean> {
    return this.authService.authUserUid();
  }
  canActivateChild(): Observable<boolean> {
    return this.authService.authUserUid();
  }
  canLoad(): Observable<boolean> {
    return this.authService.authUserUid();
  }
}
