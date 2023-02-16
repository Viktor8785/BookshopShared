import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { DatabaseService } from 'src/app/shared/database.service';
import { merge, Subscription} from 'rxjs';
import { EmitService } from 'src/app/shared/emit.service';
import { UserBooksModel } from 'src/app/users/model/user.books.model';
import { UserOrderModel } from '../../model/user.order.model';
import { UserModel } from '../../model/user.model';

@Component({
  selector: 'app-user-cabinet-nav',
  templateUrl: './user.cabinet.nav.component.html',
  styleUrls: ['./user.cabinet.nav.component.css']
})
export class UserCabinetNavComponent implements OnInit {
  public textBlock = '';
  public showButtonMakeOrder = false;
  public desabledMakeOrder = true;
  private allowedNumber = 0;
  public orderedNumber = '0';
  public reservedNumber = '0';
  public viewedNumber = '0';
  public reservedNumNumber = 0;
  public userBlocked = true;
  private orders: UserOrderModel[] = [];
  private books: UserBooksModel[] = [];
  private subscr!: Subscription;
  private subscr2!: Subscription;
  private subscr3!: Subscription;
  private subscr4!: Subscription;
  private subscr5!: Subscription;

  constructor(
    private emitService: EmitService,
    private authService: AuthService,
    private dbService: DatabaseService
  ) {
      if(this.authService.userDataId) {
        this.getUserBooksOrders(this.authService.userDataId);
      }
      this.authService.authState();
      this.subscr = this.emitService.getAuthState().subscribe((userId: string) => {
        this.getUserBooksOrders(userId);
      });
      this.getShowButtonMakeOrder();
  }

  getClasses(value: string): string {
    const width = document.documentElement.clientWidth;
    let normal = '';
    let small = '';
    switch(value) {
      default:
      case 'div': {
        normal = 'nav-fixed';
        small = 'nav-fixed-small';
      }
      break;
      case 'span': {
        normal = '';
        width < 1280 ? small = 'ms-3' : small = '';
      }
      break;
      case 'user': {
        normal = 'col-3';
        width < 1360 ? small = 'col-2' : 'col-3';
      }
      break;
      case 'but': {
        normal = 'col-2';
        small = 'col-1 mt-4';
      }
      break;
      case 'userblock': {
        normal = 'col-4';
        small = 'col-4 m-0 p-0 mt-2';
      }
      break;
    }
    return width < 1600 ? small : normal; 
  }
  
  shrinkText(text: string, value: number) {
    const width = document.documentElement.clientWidth;
    return width < 1360 && text.length > value ? text.slice(0, value) + "\u2026" : text;    
  }
  
  getShowButtonMakeOrder() {
    this.subscr4 = this.emitService.getShowButtonMakeOrder().subscribe(mes => {
        if(mes == 'booked') {
          this.showButtonMakeOrder = true;
        } else {
          this.showButtonMakeOrder = false;
        }
      });
  }
  
  getUserBooksOrders(userId: string) {
      if(!this.subscr2) {
        this.subscr2 = merge(
          this.dbService.getUserBooksDatas(userId),
          this.dbService.getUserOrders(userId),
          this.dbService.getUserData(userId)
        ).subscribe((docs) => {
          if(docs instanceof Array) {
            if(docs.length && 'bookId' in docs[0]) {
              this.books = docs as UserBooksModel[];
              this.allowedNumber = this.books.filter(book => book.allowed && book.reserved).length;
              this.reservedNumber = String(this.books.filter(book => book.reserved).length);
              this.viewedNumber = String(this.books.length);
              this.orderedNumber = String(this.books.filter(book => book.ordered).length);
              this.isDesabledMakeOrder();
            };
            if(docs.length && 'orderId' in docs[0]) {
              this.orders = docs as UserOrderModel[];
              this.isDesabledMakeOrder();
            };
          } else {
            const user = docs as UserModel;
            if(user) {
              this.userBlocked = user.userBlocked as boolean;
              this.isDesabledMakeOrder();
            }
          };
        });
      };
    }
  
    isDesabledMakeOrder() {
      if(this.orders && this.orders.length) {
        (this.allowedNumber > 0 && this.orders.filter(order => !order.returned).length == 0 && !this.userBlocked)
          ? this.desabledMakeOrder = false
          : this.desabledMakeOrder = true;
      } else {
        (this.allowedNumber > 0 && !this.userBlocked)
          ? this.desabledMakeOrder = false
          : this.desabledMakeOrder = true;
      };
    }
  
  get showTextBlock(): string {
    const width = document.documentElement.clientWidth;
    return (width < 1900 && width >= 1600) ? 'block' : 'BLOCK'; 
  }
  
  get userName() {
    return this.shrinkText(this.authService.userData?.displayName, 5);
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
    if(this.subscr4) {
      this.subscr4.unsubscribe();
    };
    if(this.subscr5) {
      this.subscr5.unsubscribe();
    };
  }
}
