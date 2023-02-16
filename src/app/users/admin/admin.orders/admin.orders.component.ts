import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/shared/database.service';
import { Subscription } from 'rxjs';
import { EmitService } from 'src/app/shared/emit.service';
import { OrderModel } from 'src/app/model/order.model';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin.orders.component.html',
  styleUrls: ['./admin.orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  private subscr!: Subscription;
  private subscr2!: Subscription; 
  public orders: OrderModel[] = [];
  public orders2: OrderModel[] = [];
  public isMouseOver = -1;
  public currentIndex = 0;
  public modalSpin = false;
  constructor(
    private dbService: DatabaseService,
    private emitService: EmitService
  ) {
    this.modalSpin = true;
    this.subscr = this.dbService.getOrders().subscribe((orders: OrderModel[]) => {
      this.orders2 = orders;
      this.orders = this.orders2.sort((a, b) => {
        if(a.orderDate && b.orderDate) {
          return b.orderDate.toMillis() - a.orderDate.toMillis();
        }
        return 1;
      });
      this.modalSpin = false;  
    });
  }

  userDetails(userId: string, linkBack: string, i: number) {
    this.currentIndex = i;
    this.emitService.saveUserId(userId);
    this.emitService.saveLinkBackUsers(linkBack);
  }
  

   orderDetails(orderId: string, userId: string, i: number) {
    this.currentIndex = i;
    this.emitService.saveOrderId(orderId);
    this.emitService.saveUserId(userId);
    this.emitService.saveLinkBack('/admin/admin-orders');
  }
   
   getStyle(index: number) {
     if(index == this.currentIndex) {
       return {'background-color': 'rgba(240, 238, 238, 0.2)'};
     } else {
       return null;
     };
   }
   
   getStyleOrders(value: number): any {
     const height = document.documentElement.clientHeight;
     const width = document.documentElement.clientWidth;
     let heightValue = height - 51 - value * 2;
     let widthValue = width - value * 2;
     widthValue > 1300 ? widthValue = 1300 : true;
     return {
       'height':heightValue.toString() + 'px',
       'width':widthValue.toString() + 'px',
       'overflow-y': 'auto'
     };
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
