import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmitService } from 'src/app/shared/emit.service';
import { mergeMap, Subscription, takeLast, catchError, timeout, merge, from, finalize } from 'rxjs';
import { AuthService } from '../../../shared/auth.service'; 
import { UserModel } from 'src/app/users/model/user.model';  
import { DatabaseService } from '../../../shared/database.service';
import { UserBooksModel } from 'src/app/users/model/user.books.model';
import { OrderModel } from '../../../model/order.model';
import { OrderBooksModel } from '../../../model/order.books.model';
import { UserOrderModel } from '../../model/user.order.model';
import { UserOrderBooksModel } from '../../model/user.order.books.model';
import { BooksOrderedModel } from '../../../model/books.ordered.model';
import { Timestamp } from "firebase/firestore";
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-order',
  templateUrl: './user.order.component.html',
  styleUrls: ['./user.order.component.css']
})
export class UserOrderComponent implements OnInit {
  private dateMillis = +(new Date()) / 1000;
  private subscr!: Subscription;
  private subscr2!: Subscription;
  private subscr3!: Subscription;
  private subscr4!: Subscription;
  private subscr5!: Subscription;
  private subscr6!: Subscription;
  private notAllowMess = '';
  public allAllowed = true;
  public userProfile!: UserModel;
  public modalSpin = false;
  public submitDesable = false;
  private userId = '';
  private userData!: any;
  private ordersNumber = 0;
  private newOrdersNumber = '';
  private orders: OrderModel[] = [];
  public userBooks: UserBooksModel[] = [];

  constructor(
    private emitService: EmitService,
    private authService: AuthService,
    private dbService: DatabaseService,
    private router: Router
  ) {
    const date = new Date('2000-01-01'); 
    this.userProfile = new UserModel('', '', '', '', '', new Timestamp((+date / 1000), 0), '', '', '', '');
    this.authService.authState();
    if(this.authService.userDataId) {
      this.getUserDataBooks(this.authService.userDataId);
    }
    this.subscr = this.emitService.getAuthState().subscribe((userId: string) => {
      this.getUserDataBooks(userId);
    });
  }

  getUserDataBooks(userId: string) {
    const date = new Date('2000-01-01'); 
    if(userId) {
      this.userId = userId;
      this.userData = this.authService.userData;
      this.subscr2 = this.dbService.getUserData(userId).subscribe((doc: any) => {
        if(doc) {
          this.userProfile = doc;
        } else {
          this.userProfile = new UserModel(userId, this.userData.email, this.userData.displayName,
            this.userData.displayName, this.userData.email, new Timestamp((+date / 1000), 0), '', '', '', '');
        };
        this.subscr2.unsubscribe();
      });
      this.subscr3 = this.dbService.getUserBooksDatas(userId).subscribe((books: UserBooksModel[]) => {
        const booksReserved = books.filter((book) => book.reserved);
        this.userBooks = books.filter((book) => book.reserved && book.allowed);
        if(this.userBooks.length < booksReserved.length) {
          this.allAllowed = false;
          this.notAllowMess = ', but not all items have been added to your order!'
        };
        this.subscr3.unsubscribe();
      });
    }
  }
  
  submitForm(form: NgForm) {
    if(form.valid) {
      this.modalSpin = true;
      this.subscr5 = this.dbService.getOrdersNumber().pipe(timeout(10000)).subscribe({
        next: ordersNumber => {
          this.subscr5.unsubscribe();
          if(ordersNumber.lastNumber) {
            this.ordersNumber = ordersNumber.lastNumber;
          };
          this.ordersNumber++;
          this.newOrdersNumber = String(this.ordersNumber);
          const orderData = this.setOrderData();
          const userOrderData = this.setUserOrderData();
          this.subscr6 = merge(
            this.dbService.updateOrdersNumber(this.ordersNumber),
            this.dbService.setOrder(orderData),
            this.dbService.setUserOrderData(userOrderData)
          ).pipe(timeout(10000), takeLast(1)).subscribe({
            next: () => {
              this.subscr6.unsubscribe();
              this.updateUsersBooksOrdersDatas();
            },
            error: () => {
              this.modalSpin = false;
              this.showErrorMess();
              this.subscr5.unsubscribe();
              this.subscr6.unsubscribe();
            }
          });
        },
        error: () => {
          this.modalSpin = false;
          this.showErrorMess();
          this.subscr6.unsubscribe(); 
        }
      });  
    }
  }  
  
  updateUsersBooksOrdersDatas() {
    this.subscr4 = from(this.userBooks).pipe(
      mergeMap(book => merge(
        this.dbService.updateUserBooksDataOrdered(this.userId, book.bookId, true, new Timestamp(this.dateMillis, 0)).pipe(timeout(10000)),
        this.dbService.updateUserBooksDataReserved(this.userId, book.bookId, true).pipe(timeout(10000)),
        this.dbService.setOrderBooks(this.newOrdersNumber, new OrderBooksModel(this.newOrdersNumber, book.bookId, this.userId)).pipe(timeout(10000)),
        this.dbService.setUserOrderBooks(this.setUserOrderBooks(book.bookId)).pipe(timeout(10000)),
        this.dbService.setBooksOrdered(this.setBooksOrderedData(book.bookId)).pipe(timeout(10000))
      )),
      takeLast(1),
      catchError(() => from('e'))
    )
    .subscribe({
      next: doc => {
        this.modalSpin = false;
        if(doc) {
          this.subscr4.unsubscribe();
          this.showErrorMess(); 
        } else {
          this.emitService.saveErrorMessage('Your Order has been successfully placed' + this.notAllowMess);
          this.router.navigate([{outlets: {popup: ['message']}}]);
          this.submitDesable = true; 
        };
      }
    });    
  }
  
  setOrderData() {
    const orderData = new OrderModel(
      this.newOrdersNumber, this.userId, this.userData.email,
      false, null, new Timestamp(this.dateMillis, 0), false,
      null, false, null
    );
    return orderData;
  }
  
  setUserOrderData() {
    const userOrderData = new UserOrderModel(
      this.newOrdersNumber,
      this.userId,
      this.userProfile.userName,
      this.userProfile.userEmail,
      this.userProfile.userZipCode,
      this.userProfile.userCountry,
      this.userProfile.userCity,
      this.userProfile.userAddress,
      false, null, new Timestamp(this.dateMillis, 0), false, null, false, null
    );
    return userOrderData;
  }
  
  setBooksOrderedData(bookId: string) {
    const booksOrderedData = new BooksOrderedModel(
      this.newOrdersNumber,
      bookId,
      this.userId,
      this.userData.email,
      this.userBooks[this.getBookIndex(bookId)].title,
      this.userBooks[this.getBookIndex(bookId)].authorName,
      true, new Timestamp(this.dateMillis, 0), false, null, false, null
    );
    return booksOrderedData;
  }

  setUserOrderBooks(bookId: string) {
    const userOrderBooks = new UserOrderBooksModel(
      this.newOrdersNumber,
      bookId,
      this.userId,
      this.userBooks[this.getBookIndex(bookId)].title,
      this.userBooks[this.getBookIndex(bookId)].authorName
    );
    return userOrderBooks;
  }
  
  showErrorMess() {
    this.emitService.saveErrorMessage('Failed making your Order.');
    this.router.navigate([{outlets: {popup: ['message']}}]);
  }
  
  getBookIndex(bookId: string) {
    return this.userBooks.findIndex((book) => book.bookId == bookId);
  }

  getClasses(value: string): string {
    const width = document.documentElement.clientWidth;
    let normal = '';
    let small = '';
    switch(value) {
      default:
      case 'div': {
        normal = 'div-fixed';
        small = 'div-fixed-small';
      }
      break;
      case 'but': {
        normal = 'col-1';
        small = 'col-2';
      }
      break;
    }
    return width < 1600 ? small : normal; 
  }
  
  getStyleOrders(value: number): any {
    const height = document.documentElement.clientHeight;
    const width = document.documentElement.clientWidth;
    let heightValue = width <= 1600 ? height - 85 - value * 2 : height - 51 - value * 2;
    heightValue = heightValue - 100 - 47;
    return {
      'height':heightValue.toString() + 'px',
      'overflow-y': 'auto'
    };
  }
  
  getStyle(value: number): any {
    const height = document.documentElement.clientHeight;
    const width = document.documentElement.clientWidth;
    let heightValue = width <= 1600 ? height - 85 - value * 2 : height - 51 - value * 2;
    let widthValue = width - value * 2;
    return {
      'height': heightValue.toString() + 'px',
      'width': widthValue.toString() + 'px',
      'overflow-y': 'auto'
    };
  }
  
  resetForm() {
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
    if(this.subscr6) {
      this.subscr6.unsubscribe();
    };
  }
}
