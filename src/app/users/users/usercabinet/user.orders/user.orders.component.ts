import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/auth.service'; 
import { UserOrderModel } from '../../model/user.order.model';
import { EmitService } from 'src/app/shared/emit.service';
import { DatabaseService } from '../../../shared/database.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user.orders.component.html',
  styleUrls: ['./user.orders.component.css']
})
export class UserOrdersComponent implements OnInit {
  private subscr!: Subscription;
  private subscr2!: Subscription;
  public userOrders: UserOrderModel[] = [];
    
  constructor(
    private emitService: EmitService,
    private authService: AuthService,
    private dbService: DatabaseService,
  ) {
    this.authService.authState();
    if(typeof this.authService.userDataId !== undefined) {
      this.getUserOrders(this.authService.userDataId);
    }
    this.subscr = this.emitService.getAuthState().subscribe((userId: string) => {
      this.getUserOrders(userId);
    });
  }

  getUserOrders(userId: string) {
    if(userId) {
      this.subscr2 = this.dbService.getUserOrders(userId).subscribe((orders: UserOrderModel[]) => {
        this.userOrders = orders.sort((a, b) => Number(b.orderId) - Number(a.orderId));
      });
    }
  }

  getHeight(value: number): any {
    const height = document.documentElement.clientHeight;
    const width = document.documentElement.clientWidth;
    let heightValue = width <= 1600 ? height - 85 - value * 2 : height - 51 - value * 2;
    return {'height':heightValue.toString() + 'px'};
  }

  getClasses(): string {
    const width = document.documentElement.clientWidth;
    return width <= 1600 ? 'div-fixed-small' : 'div-fixed'; 
  }
  
  ngOnInit(): void {
  }

  ngOnDestroy() {
    if(this.subscr) {
      this.subscr.unsubscribe();
    };
    if(this.subscr2) {
      this.subscr2.unsubscribe();
    };
  }
}
