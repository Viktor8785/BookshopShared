import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { usercabinetCanDeactivateGuard } from './guard/usercabinet.candeactivate.guard';

const routes: Routes = [
    { path: '', component: UsercabinetComponent, children: [
        { path: 'user-cabinet-nav', component: UserCabinetNavComponent },
        { path: 'user-cabinet-booked', component: UserCabinetBookedComponent }, 
        { path: 'user-cabinet-viewed', component: UserCabinetViewedComponent },
        { path: 'user-order', component: UserOrderComponent },
        { path: 'user-orders', component: UserOrdersComponent },
        { path: 'user-order-detail', component: UserOrderDetailComponent },
        { path: 'user-cabinet-personaldata', component: UserCabinetSetPersonaldataComponent,
          canDeactivate: [usercabinetCanDeactivateGuard] },
        { path: 'user-cabinet-change-password', component: UserCabinetChangePasswordComponent },
        { path: 'user-cabinet-change-email', component: UserCabinetChangeEmailComponent },
        { path: '', redirectTo: 'user-cabinet-viewed', pathMatch: 'full'}
      ]
    },
];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsercabinetRoutingModule { }
