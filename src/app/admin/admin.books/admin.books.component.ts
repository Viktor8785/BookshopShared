import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/shared/database.service';
import { Subscription, from, mergeMap, map, finalize, take } from 'rxjs';
import { EmitService } from 'src/app/shared/emit.service';
import { BooksOrderedModel } from 'src/app/model/books.ordered.model';

@Component({
  selector: 'app-admin-books',
  templateUrl: './admin.books.component.html',
  styleUrls: ['./admin.books.component.css']
})
export class AdminBooksComponent implements OnInit {
  private subscr!: Subscription;
  private subscr2!: Subscription; 
  public booksOrdered: BooksOrderedModel[] = [];
  public isMouseOver = -1;
  public currentIndex = 0;
  public modalSpin = false;

  constructor(
    private dbService: DatabaseService,
    private emitService: EmitService
  ) {
      this.modalSpin = true;
      this.subscr = this.dbService.getBooksOrdered().subscribe((books: BooksOrderedModel[]) => {
        this.booksOrdered = books.sort((a, b) => {
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
  this.emitService.saveLinkBack('/admin/admin-books');
}

getStyle(index: number) {
  if(index == this.currentIndex) {
    return {'background-color': 'rgba(240, 238, 238, 0.2)'};
  } else {
    return null;
  };
}

getStyleBooks(token: string, value: number): any {
  const height = document.documentElement.clientHeight;
  const width = document.documentElement.clientWidth;
  let heightValue = height - 51 - value * 2;
  let widthValue = width - value * 2;
  switch (token) {
    default:
    case 'doc': {
      widthValue > 1500 ? widthValue = 1500 : true;
    };
    break;
    case 'spin': {
      heightValue = heightValue / 2 - 30; 
      widthValue = widthValue / 2 -30;
      return {
        'margin-top': heightValue.toString() + 'px',
        'margin-left': widthValue.toString() + 'px',
        'z-index': '960'
      };
    };
    break;
  }
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
