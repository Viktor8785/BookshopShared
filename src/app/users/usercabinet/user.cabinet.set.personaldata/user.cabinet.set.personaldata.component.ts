import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmitService } from 'src/app/shared/emit.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../shared/auth.service'; 
import { UserModel } from '../../model/user.model';  
import { DatabaseService } from '../../../shared/database.service';
import { Timestamp } from "firebase/firestore";
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-cabinet-set-personaldata',
  templateUrl: './user.cabinet.set.personaldata.component.html',
  styleUrls: ['./user.cabinet.set.personaldata.component.css']
})
export class UserCabinetSetPersonaldataComponent implements OnInit {
  private subscr!: Subscription;
  private subscr2!: Subscription;
  private date = new Date('2000-01-01');
  public userProfile: UserModel = new UserModel('', '', '', '', '', new Timestamp((+this.date / 1000), 0), '', '', '', '', false);
  public userProfileOriginal = new UserModel('', '', '', '', '', new Timestamp((+this.date / 1000), 0), '', '', '', '', false);
  public userBirthDate!: any;

  constructor(
    private router: Router,
    private emitService: EmitService,
    private authService: AuthService,
    private dbService: DatabaseService,
  ) {
    this.authService.authState();
    if(typeof this.authService.userDataId !== undefined) {
      this.getUserData(this.authService.userDataId);
    }
    this.subscr = this.emitService.getAuthState().subscribe((userId: string) => {
      this.getUserData(userId);
    });
  }

  getUserData(userId: string) {
    if(userId) {
      const userData = this.authService.userData;
      this.subscr2 = this.dbService.getUserData(userId).subscribe((doc: UserModel) => {
        if(doc.userId) {
          this.userProfile = doc;
          Object.assign(this.userProfileOriginal, this.userProfile);
        } else {
          this.userProfile = new UserModel(userId, userData.email, userData.displayName,
          userData.displayName, userData.email, new Timestamp((+this.date / 1000), 0), '', '', '', '', false);
          this.userProfileOriginal = new UserModel(userId, userData.email, userData.displayName,
            userData.displayName, userData.email, new Timestamp((+this.date / 1000), 0), '', '', '', '', false);
        }
        this.userBirthDate = new Date(this.userProfile.userBirthDate.seconds * 1000).toISOString().substring(0,10);
      });
    };
  }

  submitForm(form: NgForm) {
  if(form.valid) {
    this.userProfile.userBirthDate = new Timestamp((Date.parse(this.userBirthDate) / 1000), 0);
    this.userProfileOriginal = this.userProfile;
    this.subscr = this.dbService.setUserData(this.userProfile).subscribe((doc: any) => {
      this.emitService.saveErrorMessage('Your Profile has been successfully saved.');
      this.router.navigate([{outlets: {popup: ['message']}}]);
    });
  };
}  

getStyle() {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  return width <= 1600 ? {'height': (height - 85).toString() + 'px'} : {'height': (height - 51).toString() + 'px'}; 
}

getClasses(token: string): string {
  const width = document.documentElement.clientWidth;
  let normal = '';
  let small = '';
  switch(token) {
    default:
    case 'doc': {
      normal = 'div-fixed';
      small = 'div-fixed-small';
    };
    break;
    case 'div': {
      normal = 'div-body';
      small = 'div-body-small';
    }
  }
  return width <= 1600 ? small : normal; 
}
resetForm() {
}

ngOnInit(): void {
}

ngOnDestroy() {
  if(this.subscr) {
    this.subscr.unsubscribe();
  };
  if(this.subscr2) {
    this.subscr2.unsubscribe();
  };
}

}
