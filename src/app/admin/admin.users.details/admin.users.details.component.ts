import { Component, OnInit } from '@angular/core';
import { EmitService } from 'src/app/shared/emit.service';
import { Subscription, merge, timeout, from, mergeMap, finalize, take } from 'rxjs';
import { UserModel } from 'src/app/users/model/user.model';  
import { DatabaseService } from 'src/app/shared/database.service';
import { UserOrderModel } from 'src/app/users/model/user.order.model';
import { UserOrderBooksModel } from 'src/app/users/model/user.order.books.model';
import { Timestamp } from "firebase/firestore";
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-users-details',
  templateUrl: './admin.users.details.component.html',
  styleUrls: ['./admin.users.details.component.css']
})
export class AdminUsersDetailsComponent implements OnInit {
  private date = new Date('2000-01-01');
  public userProfile: UserModel = new UserModel('','','','','',new Timestamp((+this.date / 1000), 0),'','','','');
  private subscr!: Subscription;
  private subscr2!: Subscription;
  private subscr3!: Subscription;
  private subscr4!: Subscription;
  private subscr5!: Subscription;
  private subscr6!: Subscription;
  private subscr7!: Subscription;
  private subscr8!: Subscription;
  private subscr9!: Subscription;
  private subscr10!: Subscription;
  private subscr11!: Subscription;
  public userOrderBooks: UserOrderBooksModel[] = [];
  public userOrders: UserOrderModel[] = [];
  public userOrder: UserOrderModel = new UserOrderModel('','','','','','','','',false,null,null,false,null,false,null);
  private userId!: string;
  public isMouseOver = -1;
  public currentIndex = 0;
  public dateMillis!: Timestamp;
  public formControlReceived!: FormControl;
  public formControlReturned!: FormControl;
  public formControlSentEmail!: FormControl; 

  constructor(
    private emitService: EmitService,
    private dbService: DatabaseService,
    private router: Router
  ) {
    this.formControlReceived = new FormControl('', Validators.required);
    this.formControlReturned = new FormControl('', Validators.required);
    this.formControlSentEmail = new FormControl('', Validators.required);
  }

  getStyle(index: number) {
    if(index == this.currentIndex) {
      return {'background-color': 'rgba(240, 238, 238, 0.3)'};
    } else {
      return null;
    };
  }
  
  getStyleUserDetail(token: string, value: number): any {
    const height = document.documentElement.clientHeight;
    const width = document.documentElement.clientWidth;
    let heightValue = height - 51;
    let widthValue = width - value * 2;
    let overflowValue = 'hidden';
    switch(token) {
      default:
      case 'doc': {
        if(widthValue > 1500) {
          widthValue = 1500;
        }
      };
      break;
      case 'user': {
        heightValue = 200;
        widthValue = 800; 
      };
      break;
      case 'order': {
        heightValue = height - 51 - 254 -74;
        widthValue = (width - value * 2);
        if(widthValue > 1500) {
          widthValue = 1500;
        }
        overflowValue = 'auto'; 
      };
      break;
    };
    return {
      'height': heightValue.toString() + 'px',
      'width': widthValue.toString() + 'px',
      'overflow': overflowValue
    };
  }
  
  sendEmailText(): string {
    const width = document.documentElement.clientWidth;
    let sendEmail = 'Send Email';
    width <= 1600 ? sendEmail = 'Send E' + "\u2026" : true; 
    return sendEmail;
  }
  
  sentEmail() {
    if(this.formControlSentEmail.valid) {
      const date = new Date(this.formControlSentEmail.value);
      this.subscr6 = merge(
        this.dbService.updateUserOrderSentEmail(this.userId, this.userOrder.orderId, new Timestamp((+date / 1000), 0)),
        this.dbService.updateOrderSentEmail(this.userOrder.orderId, new Timestamp((+date / 1000), 0))
      )
      .pipe(
        timeout(10000),
        finalize(() => this.subscr6.unsubscribe())
      )
      .subscribe();
    }
  }

  markReceived() {
    if(this.formControlReceived.valid) {
      const date = new Date(this.formControlReceived.value);
      this.subscr8 = merge(
        this.dbService.updateUserOrderReceived(this.userId, this.userOrder.orderId, new Timestamp((+date / 1000), 0)),
        this.dbService.updateOrderReceived(this.userOrder.orderId, new Timestamp((+date / 1000), 0))
      )
      .pipe(
        timeout(10000),
        finalize(() => this.subscr8.unsubscribe())
      )  
      .subscribe();
      this.subscr10 = from(this.userOrderBooks).pipe(
        mergeMap((book: UserOrderBooksModel) => this.dbService.updateBooksOrderedReceived(book.bookId, new Timestamp((+date / 1000), 0)).pipe(timeout(10000))),
        take(this.userOrderBooks.length),
        finalize(() => this.subscr10.unsubscribe())
      )
      .subscribe();
    }
  }

  markReturned() {
    if(this.formControlReturned.valid) {
      const date = new Date(this.formControlReturned.value);
      this.subscr9 = merge(
        this.dbService.updateUserOrderReturned(this.userId, this.userOrder.orderId, new Timestamp((+date / 1000), 0)),
        this.dbService.updateOrderReturned(this.userOrder.orderId, new Timestamp((+date / 1000), 0))
      )
      .pipe(
        timeout(10000),
        finalize(() => this.subscr9.unsubscribe())
      )
      .subscribe();
      this.subscr11 = from(this.userOrderBooks).pipe(
        mergeMap((book: UserOrderBooksModel) => this.dbService.deleteBooksOrdered(book.bookId).pipe(timeout(10000))),
        take(this.userOrderBooks.length),
        finalize(() => this.subscr11.unsubscribe())
      )
      .subscribe();
    }
  }

  returnBack() {
    const linkBack = this.emitService.getLinkBackUsers();
    if(linkBack) {
      this.emitService.saveLinkBackUsers(null);
      this.router.navigateByUrl(linkBack);
    };
  }

  newOrderId(orderId: string, userId: string, i: number) {
    this.currentIndex = i;
    this.emitService.saveOrderId(orderId);
    this.emitService.saveUserId(userId);
    this.emitService.saveLinkBack('/admin/admin-users-details');
  }
  
  ngOnInit(): void {
    this.userId = this.emitService.getUserId();
    this.subscr2 = this.dbService.getUserData(this.userId).subscribe((doc: any) => {
      if(doc) {
        this.userProfile = doc;
        this.subscr2.unsubscribe();
      };
    });
    this.subscr3 = this.dbService.getUserOrders(this.userId).subscribe((orders: UserOrderModel[]) => {
      if(orders.length) {
        this.userOrders = orders.sort((a, b) => Number(b.orderId) - Number(a.orderId));
      }
    });
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
    if(this.subscr4) {
      this.subscr4.unsubscribe();
    };
    if(this.subscr5) {
      this.subscr5.unsubscribe();
    };
    if(this.subscr6) {
      this.subscr6.unsubscribe();
    };
    if(this.subscr7) {
      this.subscr7.unsubscribe();
    };
    if(this.subscr8) {
      this.subscr8.unsubscribe();
    };
    if(this.subscr9) {
      this.subscr9.unsubscribe();
    };
    if(this.subscr10) {
      this.subscr10.unsubscribe();
    };
    if(this.subscr11) {
      this.subscr11.unsubscribe();
    };
  }
}
