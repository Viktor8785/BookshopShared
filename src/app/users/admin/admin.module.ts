import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { AdminNavComponent } from './admin.nav/admin.nav.component';
import { RouterModule } from '@angular/router';
import { AdminUsersComponent } from './admin.users/admin.users.component';
import { AdminBooksComponent } from './admin.books/admin.books.component';
import { AdminOrdersComponent } from './admin.orders/admin.orders.component';
import { AdminOrderDetailsComponent } from './admin.order.details/admin.order.details.component';
import { AdminUsersDetailsComponent } from './admin.users.details/admin.users.details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AdminComponent,
    AdminNavComponent,
    AdminUsersComponent,
    AdminBooksComponent,
    AdminOrdersComponent,
    AdminOrderDetailsComponent,
    AdminUsersDetailsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    SharedModule
  ],
  exports: [
    AdminComponent,
    AdminNavComponent,
    AdminUsersComponent,
    AdminBooksComponent,
    AdminOrdersComponent,
    AdminOrderDetailsComponent,
    AdminUsersDetailsComponent,
  ]
})
export class AdminModule { }
