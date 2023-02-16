import { Component, OnInit } from '@angular/core';
import { EmitService } from 'src/app/shared/emit.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../shared/auth.service'; 
import { DatabaseService } from '../../../shared/database.service';
import { UserOrderModel } from '../../model/user.order.model';
import { UserOrderBooksModel } from '../../model/user.order.books.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-order-detail',
  templateUrl: './user.order.detail.component.html',
  styleUrls: ['./user.order.detail.component.css']
})
export class UserOrderDetailComponent implements OnInit {
  private subscr!: Subscription;
  private subscr2!: Subscription;
  private subscr3!: Subscription;
  public userOrderBooks : UserOrderBooksModel[] =[];
  public userOrder: UserOrderModel = new UserOrderModel('', '', '', '', '', '', '',
   '', false, null, null, false, null, false, null);
  
  constructor(
    private activRoute: ActivatedRoute,
    private emitService: EmitService,
    private authService: AuthService,
    private dbService: DatabaseService
  ) {
    this.authService.authState();
    if(typeof this.authService.userDataId !== undefined) {
      this.getUserOrderData(this.authService.userDataId);
    }
    this.subscr = this.emitService.getAuthState().subscribe((userId: string) => {
      this.getUserOrderData(userId);
    });
  }

  getUserOrderData(userId: string) {
    if(userId) {
      const orderId: string = this.activRoute.snapshot.params['orderId'];
      this.subscr2 = this.dbService.getUserOrderData(userId, orderId).subscribe((order: UserOrderModel) => {
        this.userOrder = order;
      });
      this.subscr3 = this.dbService.getUserOrderBooks(userId, orderId).subscribe((books: UserOrderBooksModel[]) => {
        this.userOrderBooks = books;
      });
    }
  }

  getStyle(value: number): any {
    const height = document.documentElement.clientHeight;
    const width = document.documentElement.clientWidth;
    let heightValue = width <= 1600 ? height - 85 - value * 2 : height - 51 - value * 2;
    let widthValue = width - value * 2;
    return {
      'height': heightValue.toString() + 'px',
      'width': widthValue.toString() + 'px',
      'overflow': 'hidden'
    };
  }

  getStyleOrders(value: number): any {
    const height = document.documentElement.clientHeight;
    const width = document.documentElement.clientWidth;
    let heightValue = width <= 1600 ? height - 85 - value * 2 : height - 51 - value * 2;
    heightValue = heightValue - 85 - 70;
    return {
      'height':heightValue.toString() + 'px',
      'overflow-y': 'auto'
    };
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
    if(this.subscr3) {
      this.subscr3.unsubscribe();
    };
  }
}
