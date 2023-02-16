import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserCabinetSetPersonaldataComponent } from '../user.cabinet.set.personaldata/user.cabinet.set.personaldata.component';
import { UserModel } from 'src/app/users/model/user.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class usercabinetCanDeactivateGuard implements CanDeactivate<unknown> {

  constructor(private dialog: MatDialog) { }
  
  canDeactivate(component: UserCabinetSetPersonaldataComponent): Observable<boolean> | boolean {
    for(let prop in component.userProfileOriginal) {
    if(component.userProfileOriginal[prop as keyof UserModel] !=
      component.userProfile[prop as keyof UserModel]) {
        const dialogRef = this.dialog.open(DialogComponent,
          {
            height: '210px',
            width: '420px',
            enterAnimationDuration: '0ms',
            exitAnimationDuration: '0ms',
            hasBackdrop: false,
            disableClose: true
          });
        return dialogRef.afterClosed();
      };
    };
    return of(true);
  }
}
