import { Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmitService } from 'src/app/shared/emit.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-forgot.password',
  templateUrl: './forgot.password.component.html',
  styleUrls: ['./forgot.password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public userLogin: string = '';
  public modalMess = false;
  public errorMess = '';
  public forgotMess = '';
  public forgotModal = false;
  private subscr!: Subscription;
    
  constructor(
    private emitService: EmitService,
    private authService: AuthService,
    private router: Router
  ) { }

  forgotModalCancel(event: any) {
    this.forgotModal = false;
    this.authService.sendResetPasswordEmail(this.userLogin);
    this.subscr = this.emitService.getSendResetPasswordEmail().subscribe((event2: string) => {
      switch(event2) {
        default: {
          this.emitErrorMessage('Failed sending email. Try again, please.');
        }
        break;
        case 'success': {  
          this.emitService.saveErrorMessage('Reset password email was successfully sent to you address.');
          this.router.navigate([{outlets: {popup:['message']}}]);
        }
        break;
      }
    });      
  }
  
  emitErrorMessage(mes: string) {
    this.emitService.saveErrorMessage(mes);
    this.emitService.saveErrorMessColor('text-danger');
    this.router.navigate([{outlets: {popup:['message']}}]);
  }
  
  submitSendEmailAddress(forgotPasswordForm: NgForm) {
    if(forgotPasswordForm.valid) {
      this.forgotModal = true;
      this.forgotMess = 'Sending reset password Email to you address. Please, check your postbox.'
    }
  }
  
  getClasses(value: string): string {
    const width = document.documentElement.clientWidth;
    let normal = '';
    let small = '';
    switch(value) {
      default:
      case 'body': {
        normal = 'user-entry-body';
        small = 'user-entry-body-small';
      }
      break;
      case 'mes': {
        normal = 'user-entry-body-mess';
        small = 'user-entry-body-mess-small';
      }
    }
    return width <= 1600 ? small : normal; 
  }
  
  ngOnInit(): void {
  }

  ngOnDestroy() {
    if(this.subscr) {
      this.subscr.unsubscribe();
    }
  }
}
