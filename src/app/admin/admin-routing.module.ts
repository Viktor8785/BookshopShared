import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AdminNavComponent } from './admin.nav/admin.nav.component';
import { AdminBooksComponent } from './admin.books/admin.books.component';
import { AdminUsersComponent } from './admin.users/admin.users.component';
import { AdminOrdersComponent } from './admin.orders/admin.orders.component';
import { AdminUsersDetailsComponent } from './admin.users.details/admin.users.details.component';
import { AdminOrderDetailsComponent } from './admin.order.details/admin.order.details.component';

const routes: Routes = [
  { path: '', component: AdminComponent, children: [
    { path: 'admin-nav', component: AdminNavComponent },
    { path: 'admin-users', component: AdminUsersComponent },
    { path: 'admin-users-details', component: AdminUsersDetailsComponent},
    { path: 'admin-books', component: AdminBooksComponent },
    { path: 'admin-orders', component: AdminOrdersComponent },
    { path: 'admin-order-details', component: AdminOrderDetailsComponent},
    { path: '', redirectTo: 'admin-users', pathMatch: 'full' }
  ]}
];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
