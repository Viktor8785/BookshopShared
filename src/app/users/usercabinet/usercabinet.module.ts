import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsercabinetComponent } from 'src/app/users/usercabinet/usercabinet.component';
import { UserCabinetNavComponent } from 'src/app/users/usercabinet/user.cabinet.nav/user.cabinet.nav.component';
import { UserCabinetBookedComponent } from 'src/app/users/usercabinet/user.cabinet.booked/user.cabinet.booked.component';
import { UserCabinetViewedComponent } from 'src/app/users/usercabinet/user.cabinet.viewed/user.cabinet.viewed.component';
import { UserCabinetSetPersonaldataComponent } from 'src/app/users/usercabinet/user.cabinet.set.personaldata/user.cabinet.set.personaldata.component';
import { UserCabinetChangePasswordComponent } from 'src/app/users/usercabinet/user.cabinet.change.password/user.cabinet.change.password.component';
import { UserCabinetChangeEmailComponent } from 'src/app/users/usercabinet/user.cabinet.change.email/user.cabinet.change.email.component';
import { UserOrderComponent } from 'src/app/users/usercabinet/user.order/user.order.component';
import { UserOrdersComponent } from 'src/app/users/usercabinet/user.orders/user.orders.component';
import { UserOrderDetailComponent } from 'src/app/users/usercabinet/user.order.detail/user.order.detail.component';
import { UsercabinetRoutingModule } from './usercabinet-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsersharedModule } from '../usershared/usershared.module';
import { IdentityValidationDirective } from '../usershared/identity.validation.directive';

@NgModule({
  declarations: [
    UsercabinetComponent,
    UserCabinetNavComponent,
    UserCabinetBookedComponent,
    UserCabinetViewedComponent,
    UserCabinetSetPersonaldataComponent,
    UserCabinetChangePasswordComponent,
    UserCabinetChangeEmailComponent,
    UserOrderComponent,
    UserOrdersComponent,
    UserOrderDetailComponent,
    IdentityValidationDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    UsercabinetRoutingModule,
    SharedModule,
    UsersharedModule
  ],
  exports: [
    UsercabinetComponent,
    UserCabinetNavComponent,
    UserCabinetBookedComponent,
    UserCabinetViewedComponent,
    UserCabinetSetPersonaldataComponent,
    UserCabinetChangePasswordComponent,
    UserCabinetChangeEmailComponent,
    UserOrderComponent,
    UserOrdersComponent,
    UserOrderDetailComponent,
  ]
})
export class UsercabinetModule { }
