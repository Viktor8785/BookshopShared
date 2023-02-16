import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { BookdetailComponent } from './books/bookdetail/bookdetail.component';
import { UserEntryComponent } from './users/userblock/user.entry/user.entry.component';
import { UserRegistrationComponent } from './users/userblock/user.registration/user.registration.component';
import { UserblockComponent } from './users/userblock/userblock.component';
import { ForgotPasswordComponent } from './users/userblock/user.entry/forgot.password/forgot.password.component';
import { adminCanloadGuard } from './admin/admin.canload.guard';
import { usercabinetCanloadGuard } from './users/usercabinet/guard/usercabinet.canload.guard';
import { mainResolver } from 'src/app/shared/main.resolver';
import { ErrorMessageComponent } from './shared/error.message/error.message.component';

const routes: Routes = [
  { path: 'message', component: ErrorMessageComponent, outlet: 'popup'},
  { path: 'admin', loadChildren:() => import('./admin/admin.module').then(m => m.AdminModule),
    canLoad: [adminCanloadGuard], canActivate: [adminCanloadGuard], canActivateChild: [adminCanloadGuard]},
  { path: 'bookshelf/bookdetail', component: BookdetailComponent },
  { path: 'uservewed/bookdetail', component: BookdetailComponent },
  { path: 'userbooked/bookdetail', component: BookdetailComponent },
  { path: 'usercabinet', loadChildren:() => import('./users/usercabinet/usercabinet.module').then(m => m.UsercabinetModule),
    canLoad: [usercabinetCanloadGuard], canActivate: [usercabinetCanloadGuard], canActivateChild: [usercabinetCanloadGuard]},
  { path: 'bookshelf', component: BooksComponent,
    children: [
      { path: 'userblock', component: UserblockComponent },
      { path: 'entry', component: UserEntryComponent }, 
      { path: 'registration', component: UserRegistrationComponent },
      { path: 'forgotpassword', component: ForgotPasswordComponent }
    ],
    resolve: {main: mainResolver}
  },
  { path: '', redirectTo: '/bookshelf', pathMatch: 'full' }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
