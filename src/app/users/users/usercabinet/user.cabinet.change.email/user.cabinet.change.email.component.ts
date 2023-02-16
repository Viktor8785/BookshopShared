import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmitService } from 'src/app/shared/emit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-cabinet-change-email',
  templateUrl: './user.cabinet.change.email.component.html',
  styleUrls: ['./user.cabinet.change.email.component.css']
})
export class UserCabinetChangeEmailComponent implements OnInit {
  public newEmail = '';
  private subscr!: Subscription;
  public typePassword = 'password';
  public showPassword = false;
  public userPassword: string = '';

  constructor(private router: Router,
    private authService: AuthService,
    private emitService: EmitService) { }
    
  setTypePassword(event: any) {
    if(this.showPassword) {
      this.typePassword = 'text';
    }
    else {
      this.typePassword = 'password'
    }
  }

  getClasses(): string {
    const width = document.documentElement.clientWidth;
    return width <= 1600 ? 'div-fixed-small' : 'div-fixed'; 
  }
  
  resetForm() {
  }
  
  submitForm(form: NgForm) {
    if (form.valid) {
      this.authService.updateEmail(this.newEmail, this.userPassword);
      this.subscr = this.emitService.getUpdateEmail().subscribe((event: string) => {
        if(event == 'success') {
          this.emitService.saveErrorMessage('We have sent a confirmation email to ' + this.newEmail
            + '. Please check your mailbox and click on the link to complete your SignUp.');
        }
        else {
          this.emitService.saveErrorMessColor('text-danger');
          this.emitService.saveErrorMessage('Failed update Email. Please SignOut, then SignIn again and try once more.');
        }
        this.router.navigate([{outlets: {popup: ['message']}}]);
      });      
    }
  }

  ngOnInit(): void {
  }

}
