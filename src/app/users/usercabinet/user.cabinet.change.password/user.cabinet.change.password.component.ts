import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmitService } from 'src/app/shared/emit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-cabinet-change-password',
  templateUrl: './user.cabinet.change.password.component.html',
  styleUrls: ['./user.cabinet.change.password.component.css']
})
export class UserCabinetChangePasswordComponent implements OnInit {
  public userPassword = '';
  public userConfirmPassword = '';
  private subscr!: Subscription;
  public typePassword = 'password';
  public showPassword = false;

  constructor(private router: Router,
    private authService: AuthService,
    private emitService: EmitService
  ) { }

  setTypePassword(form: NgForm) {
    if(this.showPassword) {
      this.typePassword = 'text';
    }
    else {
      this.typePassword = 'password'
    }
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

  getClasses(): string {
    const width = document.documentElement.clientWidth;
    return width <= 1600 ? 'div-fixed-small' : 'div-fixed'; 
  }
  
  resetForm() {
  }
  
  submitForm(form: NgForm) {
    if (form.valid) {
      this.authService.updatePassword(this.userPassword);
      this.subscr = this.emitService.getUpdatePassword().subscribe((event: string) => {
        if(event == 'success') {
          this.emitService.saveErrorMessage('Password was successfully updated.');
        }
        else {
          this.emitService.saveErrorMessColor('text-danger');
          this.emitService.saveErrorMessage('Failed update Password. Please SignOut, then SignIn again and try once more.');
        }
        this.router.navigate([{outlets: {popup: ['message']}}]);
      });      
    }
  }

  ngOnInit(): void {
  }

}
