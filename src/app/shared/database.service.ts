import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Timestamp } from "firebase/firestore";
import { Observable, from } from 'rxjs';
import { UserModel } from '../users/model/user.model';
import { UserBooksModel } from '../users/model/user.books.model';
import { UserOrderModel } from '../users/model/user.order.model';
import { OrderModel } from '../model/order.model';
import { UserOrderBooksModel } from '../users/model/user.order.books.model';
import { OrderBooksModel } from '../model/order.books.model';
import { BooksOrderedModel } from '../model/books.ordered.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private userDataCollection!: AngularFirestoreCollection<UserModel>;
  private BooksOrderedCollection!: AngularFirestoreCollection<BooksOrderedModel>;
  private orderCollection!: AngularFirestoreCollection<OrderModel>;
  
  constructor(private afs: AngularFirestore) {
    this.userDataCollection = afs.collection<UserModel>('users');
    this.orderCollection = afs.collection<OrderModel>('orders');
    this.BooksOrderedCollection = afs.collection<BooksOrderedModel>('books');
  }

  getUserOrderBooks(userId: string, orderId: string): Observable<UserOrderBooksModel[]> {
    return this.afs.doc<any>(`users/${userId}`)
    .collection('orders')
    .doc(`${orderId}`)
    .collection<UserOrderBooksModel>('books').valueChanges({idField: 'bookId'});
  }
  
  getOrdersNumber(): Observable<any> {
    return this.afs.doc<any>(`ordersnumber/0`).valueChanges();
  }

  updateOrdersNumber(ordersNumber: number): Observable<void> {
    return from(this.afs.doc<any>(`ordersnumber/0`)
    .update({lastNumber: ordersNumber})
    );
  }
  
  getUserOrderData(userId: string, orderId: string): Observable<UserOrderModel> {
    return this.afs.doc<any>(`users/${userId}/orders/${orderId}`).valueChanges();
  }
  
  getUserOrders(userId: string): Observable<UserOrderModel[]> {
    return this.afs.doc(`users/${userId}`).collection<UserOrderModel>('orders').valueChanges({idField: 'orderId'});
  }
  
  getBooksOrdered(): Observable<BooksOrderedModel[]> {
    return this.BooksOrderedCollection.valueChanges({idField: 'bookId'});
  }
  
  setBooksOrdered(bookOrderedData: BooksOrderedModel): Observable<void> {
    return from(this.afs.doc<BooksOrderedModel>(`books/${bookOrderedData.bookId}`).set(Object.assign({}, bookOrderedData)));
  }

  getOrders(): Observable<OrderModel[]> {
    return this.orderCollection.valueChanges({idField: 'orderId'});
  }

  getOrderData(orderId: string): Observable<OrderModel> {
    return this.afs.doc<any>(`orders/${orderId}`).valueChanges();
  }

  setOrder(orderData: OrderModel): Observable<void> {
    return from(this.afs.doc<OrderModel>(`orders/${orderData.orderId}`).set(Object.assign({}, orderData)));
  }

  deleteBooksOrdered(bookId: string): Observable<void> {
    return from(this.afs.doc<BooksOrderedModel>(`books/${bookId}`).delete());
  }
 
  deleteOrderReturned(orderId: string): Observable<void> {
    return from(this.afs.doc<OrderModel>(`orders/${orderId}`).delete());
  }
  
  updateBooksOrderedReturned(bookId: string, date: Timestamp): Observable<void> {
    return from(this.afs.doc<BooksOrderedModel>(`books/${bookId}`)
    .update({returned: true, returneDate: date})
    );
  }

  updateBooksOrderedReceived(bookId: string, date: Timestamp): Observable<void> {
    return from(this.afs.doc<BooksOrderedModel>(`books/${bookId}`)
    .update({received: true, receiveDate: date})
    );
  }
  
  updateOrderSentEmail(orderId: string, date: Timestamp): Observable<void> {
    return from(this.afs.doc<OrderModel>(`orders/${orderId}`)
    .update({sentEmail: true, sentEmailDate: date})
    );
  }
  
  updateOrderReceived(orderId: string, date: Timestamp): Observable<void> {
    return from(this.afs.doc<OrderModel>(`orders/${orderId}`)
    .update({received: true, receiveDate: date})
    );
  }
  
  updateOrderReturned(orderId: string, date: Timestamp): Observable<void> {
    return from(this.afs.doc<OrderModel>(`orders/${orderId}`)
    .update({returned: true, returneDate: date})
    );
  }

  updateUserOrderReturned(userId: string, orderId: string, date: Timestamp): Observable<void> {
    return from(this.afs.doc<UserModel>(`users/${userId}`)
    .collection<UserOrderModel>('orders')
    .doc(`${orderId}`)
    .update({returned: true, returneDate: date})
    );
  }

  updateUserOrderReceived(userId: string, orderId: string, date: Timestamp): Observable<void> {
    return from(this.afs.doc<UserModel>(`users/${userId}`)
    .collection<UserOrderModel>('orders')
    .doc(`${orderId}`)
    .update({received: true, receiveDate: date})
    );
  }
  
  updateUserOrderSentEmail(userId: string, orderId: string, date: Timestamp): Observable<void> {
    return from(this.afs.doc<UserModel>(`users/${userId}`)
    .collection<UserOrderModel>('orders')
    .doc(`${orderId}`)
    .update({sentEmail: true, sentEmailDate: date})
    );
  }
  
  setOrderBooks(orderId: string, orderBooksData: OrderBooksModel): Observable<void> {
    return from(this.afs.doc<OrderModel>(`orders/${orderId}`)
    .collection<OrderBooksModel>('books')
    .doc(`${orderBooksData.bookId}`)
    .set(Object.assign({}, orderBooksData)));
  }
  
  setUserData(userData: UserModel): Observable<void> {
    return from(this.afs.doc<UserModel>(`users/${userData.userId}`).set(Object.assign({}, userData)));
  }

  updateUserBlocked(userId: string, block: boolean): Observable<void> {
    return from(this.afs.doc<any>(`users/${userId}`).update({userBlocked: block}));
  }
  
  getUserData(userId: string): Observable<UserModel> {
    return this.afs.doc<any>(`users/${userId}`).valueChanges();
  }

  getUsersDatas(): Observable<UserModel[]> {
    return this.userDataCollection.valueChanges({idField: 'userId'});
  }
  
  setUserOrderBooks(userOrderBooksData: UserOrderBooksModel): Observable<void> {
    return from(this.afs.doc<UserModel>(`users/${userOrderBooksData.userId}`)
    .collection<UserOrderModel>('orders')
    .doc(`${userOrderBooksData.orderId}`)
    .collection<UserOrderBooksModel>('books')
    .doc(`${userOrderBooksData.bookId}`)
    .set(Object.assign({}, userOrderBooksData)));
  }
  
  setUserOrderData(userOrderData: UserOrderModel): Observable<void> {
    return from(this.afs.doc<UserModel>(`users/${userOrderData.userId}`)
    .collection<UserOrderModel>('orders')
    .doc(`${userOrderData.orderId}`)
    .set(Object.assign({}, userOrderData)));
  }

  setUserBooksData(userId: string, userBooksData: UserBooksModel): Observable<void> {
    return from(this.afs.doc<UserModel>(`users/${userId}`)
    .collection<UserBooksModel>('books')
    .doc(`${userBooksData.bookId}`)
    .set(Object.assign({}, userBooksData)));
  }
  
  updateUserBooksDataAllowed(userId: string, bookId: string, allowed: boolean): Observable<void> {
    return from(this.afs.doc<UserModel>(`users/${userId}`)
    .collection<UserBooksModel>('books')
    .doc(`${bookId}`)
    .update({allowed: allowed}));
  }

  updateUserBooksDataReserved(userId: string, bookId: string, reserve: boolean): Observable<void> {
    return from(this.afs.doc<UserModel>(`users/${userId}`)
    .collection<UserBooksModel>('books')
    .doc(`${bookId}`)
    .update({reserved: !reserve}));
  }

  updateUserBooksDataOrdered(userId: string, bookId: string, order: boolean, orderDate: Timestamp): Observable<void> {
    return from(this.afs.doc<UserModel>(`users/${userId}`)
    .collection<UserBooksModel>('books')
    .doc(`${bookId}`)
    .update({ordered: order, orderDate: orderDate}));
  }

  getUserBooksData(userId: string, bookId: string): Observable<UserBooksModel> {
    return this.afs.doc<any>(`users/${userId}/books/${bookId}`).valueChanges();
  }
  
  getUserBooksDatas(userId: string): Observable<UserBooksModel[]> {
    return this.afs.doc(`users/${userId}`).collection<UserBooksModel>('books').valueChanges({idField: 'bookId'});
  }
}
