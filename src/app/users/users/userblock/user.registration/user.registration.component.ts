import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmitService } from 'src/app/shared/emit.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../shared/auth.service';   
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user.registration.component.html',
  styleUrls: ['./user.registration.component.css']
})

export class UserRegistrationComponent implements OnInit {
  
  public userLogin: string = '';
  public userPassword: string = '';
  public userConfirmPassword: string = '';
  public userName: string = '';
  public userAgreement = false;
  public errorCode = '';
  public modalMess = false;
  public errorMess = '';
  private subscr!: Subscription;
  private subscr2!: Subscription;
  private subscr3!: Subscription;
  public typePassword = 'password';
  public showPassword = false;

  constructor(private router: Router,
             private emitService: EmitService,
             private authService: AuthService) { }
  
  
  submitUserRegistrationForm(form: NgForm){
    if (form.valid) {
      this.authService.createUser(this.userName, this.userLogin, this.userPassword);
      this.subscr3 = this.emitService.getCreateUser().subscribe((event: string) => {
        this.emitService.saveLinkBack('/bookshelf/entry');
        switch(event) {
          case 'success': {
            this.emitService.saveErrorMessage('We have sent a confirmation email to '
             + this.userLogin
             + '. Please check your mailbox and click on the link to complete your SignUp');
            this.router.navigate([{outlets: {popup:['message']}}]);
          }
          break;
          default: {
            this.emitErrorMessage('Failed creation of your account. Try again, please.');
          }
          break;
          case 'auth/email-already-in-use': {
            this.emitErrorMessage('Account with this email already exists. Sign in, please.');
          }
        }
      });
    };
  }
  
  emitErrorMessage(mes: string) {
    this.emitService.saveErrorMessage(mes);
    this.emitService.saveErrorMessColor('text-danger');
    this.router.navigate([{outlets: {popup:['message']}}]);
  }
  
  getClasses(): string {
    const width = document.documentElement.clientWidth;
    return width <= 1600 ? 'user-entry-body-small' : 'user-entry-body'; 
  }
  
  getStyle() {
    if(!this.userConfirmPassword || !this.userPassword) {
      return {};
    }
    if(this.userConfirmPassword == this.userPassword) {
      return {'border': '2px solid #6bc502'};
    }
    return {'border': '2px solid #ff0000'};
  }
  
  setTypePassword(event: any) {
    if(this.showPassword) {
      this.typePassword = 'text';
    }
    else {
      this.typePassword = 'password'
    }
  }
  
  resetUserregistrationForm() {

  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if(this.subscr) {
      this.subscr.unsubscribe;
    };
    if(this.subscr2) {
      this.subscr2.unsubscribe;
    };
    if(this.subscr3) {
      this.subscr3.unsubscribe;
    };
  }
}
