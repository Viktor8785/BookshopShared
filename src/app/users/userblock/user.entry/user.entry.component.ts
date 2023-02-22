import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmitService } from 'src/app/shared/emit.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/auth.service';
import { DatabaseService } from '../../../shared/database.service';
import { UserModel } from 'src/app/users/model/user.model';
import { Timestamp } from "firebase/firestore";
import { EmailValidation } from '../../usershared/email.validation';

@Component({
  selector: 'app-user-entry',
  templateUrl: './user.entry.component.html',
  styleUrls: ['./user.entry.component.css']
})
export class UserEntryComponent implements OnInit {
  private userProfile!: UserModel;
  public userId = '';
  public userLogin = '';
  public typePassword = 'password';
  public showPassword = false;
  public userEntryForm!: FormGroup;
  private subscr!: Subscription;
  private subscr2!: Subscription;
  private subscr3!: Subscription;
  private subscr4!: Subscription;

  constructor(
    private ref: ChangeDetectorRef,
    private emitService: EmitService,
    private router: Router, 
    private authService: AuthService,
    private dbService: DatabaseService,
  ) {
    this.userEntryForm = new FormGroup({
      userLogin: new FormControl('',
      [
        Validators.required,
        EmailValidation.isValid()
      ]),
      userPassword: new FormControl('',
      [
        Validators.required,
        Validators.minLength(6)
      ]),
      showPassword: new FormControl('')
    });
   }
  
  setTypePassword(event: any) {
    if(this.userEntryForm.get('showPassword')?.value) {
      this.typePassword = 'text';
    }
    else {
      this.typePassword = 'password'
    }
  }

  resetUserEntryForm() {
  }

  submitUserEntryForm() {
    if (this.userEntryForm.valid) {
      this.authService.signOut();
      this.userLogin = this.userEntryForm.get('userLogin')?.value;
      this.authService.signIn(this.userEntryForm.get('userLogin')?.value,
       this.userEntryForm.get('userPassword')?.value);
      this.subscr = this.emitService.getSignInCode().subscribe((event: string) => {
        switch(event) {
          default:
          case 'success': {  
            if(!this.subscr2) {
              this.subscr2 = this.emitService.getAuthState().subscribe(() => {
                this.createNewUserDataAndClose();
              });
            }
          }
          break;
          case 'auth/wrong-password': {
            this.emitErrorMessage('Wrong password. If you forgot your password - сlick on Forgot Password to recover.');
          }
          break;
          case 'auth/user-not-found': {
            this.emitErrorMessage('Account not found. SignUp, please.');
          }
          break; 
        };
        this.subscr.unsubscribe();
      });      
    }
  }
  
  emitErrorMessage(mes: string) {
    this.emitService.saveErrorMessage(mes);
    this.emitService.saveErrorMessColor('text-danger');
    this.router.navigate([{outlets: {popup:['message']}}]);
  }
  
  createNewUserDataAndClose() {
    this.userId = this.authService.userDataId;
    const userData = this.authService.userData;
    if(!userData.emailVerified) {
      this.emitErrorMessage('Your email address is not confirmed.' + 
      ' Please check your mailbox and click on the link to complete your SignUp.' + 
      ' If you have not received email, please send it once more by clicking "SendEmail" button.');
      return;
    }
    this.setUserProfile(userData);
    this.subscr3 = this.dbService.getUserData(this.userId).subscribe((doc: UserModel) => {
      this.subscr3.unsubscribe();
      if(doc == undefined || !doc.userId) {
        this.subscr4 = this.dbService.setUserData(this.userProfile).subscribe();
      };
      this.router.navigateByUrl('/');
    });
  }

  setUserProfile(userData: any) {
    const date = new Date('2000-01-01');
    this.userProfile = new UserModel(
    userData.uid as string,
    userData.email as string,
    userData.displayName as string,
    userData.displayName as string,
    userData.email as string,
    new Timestamp((+date / 1000), 0),'', '', '', '', false
    );
  }
  
  sendVerificationEmail(event: any) {
    this.authService.SendVerificationMail();
    this.emitService.saveErrorMessage('We have sent a confirmation email to ' + this.userLogin
    + '. Please check your mailbox and click on the link to complete your SignUp');
    this.router.navigate([{outlets: {popup:['message']}}]);
  }
  
  getFormControlValue() {
    return this.userEntryForm.get('userPassword')?.errors?.['minLength'];
  }
  
  getClasses(): string {
    const width = document.documentElement.clientWidth;
    return width <= 1600 ? 'user-entry-body-small' : 'user-entry-body'; 
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
    if(this.subscr3) {
      this.subscr3.unsubscribe();
    };
    if(this.subscr4) {
      this.subscr4.unsubscribe();
    };
  }
}
