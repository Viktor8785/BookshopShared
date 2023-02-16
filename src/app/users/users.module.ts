import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsercabinetModule } from './usercabinet/usercabinet.module';
import { SharedModule } from '../shared/shared.module';
import { UserblockComponent } from './userblock/userblock.component';
import { UserEntryComponent } from './userblock/user.entry/user.entry.component';
import { UserRegistrationComponent } from './userblock/user.registration/user.registration.component';
import { ErrorHandlerService } from '../shared/error-handler.service';
import { ForgotPasswordComponent } from './userblock/user.entry/forgot.password/forgot.password.component';
import { BookshopIfDirective } from 'src/app/users/usershared/bookshop.if.directive';
import { UsersharedModule } from './usershared/usershared.module';
import { IdentityValidationDirective2 } from './usershared/identity2.validation.directive';

@NgModule({
  declarations: [
    UserblockComponent,
    UserEntryComponent,
    UserRegistrationComponent,
    ForgotPasswordComponent,
    BookshopIfDirective,
    IdentityValidationDirective2
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    UsercabinetModule,
    SharedModule,
    UsersharedModule
  ],
  exports: [
    UserblockComponent,
    UserEntryComponent,
    UserRegistrationComponent,
    ForgotPasswordComponent,
  ],
  providers: [
    { provide: ErrorHandler, useClass: ErrorHandlerService }
  ]
})
export class UsersModule { }
