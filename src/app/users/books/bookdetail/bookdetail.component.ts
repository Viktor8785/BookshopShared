import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookDetail } from './bookDetail.model';
import { BookDetailModel } from './repository.bookDetail.model';
import { HttpParams } from '@angular/common/http';
import { AuthService } from 'src/app/shared/auth.service';
import { UserBooksModel } from 'src/app/users/model/user.books.model';
import { DatabaseService } from 'src/app/shared/database.service';
import { Subscription } from 'rxjs';
import { EmitService } from 'src/app/shared/emit.service';

@Component({
  selector: 'app-bookdetail',
  templateUrl: './bookdetail.component.html',
  styleUrls: ['./bookdetail.component.css']
})
export class BookdetailComponent implements OnInit {
  isbn: string = '';
  imgsrc: string = '';
  title: string = '';
  author: string = '';
  isLogged = false;
  activRoutePath: string = '';
  private key: string = '';
  private bookDetailUrl: string = 'https://openlibrary.org';
  private subscr!: Subscription;
  private subscr2!: Subscription;
  private subscr3!: Subscription;
  private subscr4!: Subscription;
  description: string = '';
  userBooksModel!: UserBooksModel;
  userId : string = '';
  src = '';
  isReserved = false;
  
  constructor( private route: Router,
    private activRoute: ActivatedRoute,
    private bookDetailModel: BookDetailModel,
    private authService: AuthService,
    private dbService: DatabaseService,
    private emitService: EmitService
    ) {
      this.authService.authState();
      this.activRoutePath = activRoute.snapshot.url[0].path;
      this.getBookData();
      if(this.authService.userDataId) {
        this.updateUserBookData(this.authService.userDataId);
      };
      this.subscr = this.emitService.getAuthState().subscribe((userId: string) => {
        this.updateUserBookData(userId);
      });
    }  
  
  getBookData() {
    const isbn = this.activRoute.snapshot.params['isbn'];
    const src = this.activRoute.snapshot.params['imgsrc'];
    const title = this.activRoute.snapshot.params['title'];
    const author = this.activRoute.snapshot.params['author'];
    const key = this.activRoute.snapshot.params['key'];
    if(isbn != null && src != null && title != null && author != null && key != null) {
      this.src = src;
      this.isbn = isbn;
      this.imgsrc = src.substr(0, src.length - 5) + 'L.jpg';
      this.title = title;
      this.author = author;
      this.key = key;
      this.bookDetailUrl = this.bookDetailUrl + this.key + '.json';
    }
    if(this.key) {
      this.bookDetailModel.getData(this.bookDetailUrl, this.setHttpParams());
    };
  }
  
  getBookDetail(): BookDetail {
    const bdm = this.bookDetailModel.getBookDetail();
    if(bdm.description) {
      if(Object.keys(bdm.description).includes('value')) {
        this.description = bdm.description.value;
      }
    }
    return bdm;
  }
  
  setHttpParams() {
    return new HttpParams({fromObject:{}});
  };
  
  updateUserBookData(userId: string) {
    if(this.isLoggedIn && userId) {
      this.userId = userId;
      this.subscr = this.dbService.getUserBooksData(this.userId, this.isbn).subscribe((book: UserBooksModel) => {
        if(book) {
          this.userBooksModel = book;
        } else {
          this.userBooksModel = new UserBooksModel(this.isbn, this.userId, this.title, this.author, this.src,
          this.key, true, false, true, false, null, false, null, false, null
          );
          this.subscr2 = this.dbService.setUserBooksData(this.userId, this.userBooksModel).subscribe();
        }
        this.isReserved = this.userBooksModel.reserved;
      });
    }
  }
  
  reserveBook(event: any) {
    this.subscr3 = this.dbService.updateUserBooksDataReserved(
      this.userId,
      this.isbn,
      this.isReserved
    ).subscribe();
    this.isReserved = !this.isReserved;
  }
  
  get isLoggedIn() {
    return this.authService.isLoggedIn;
  } 

  getClasses(volume: string): string {
    const width = document.documentElement.clientWidth;
    let small = '';
    let normal = '';
    switch(volume) {
      default:
      case 'img': {
        normal = 'col-3';
        small = 'col-4';
      }
      break;
      case 'div': {
        normal = 'col-7';
        small = 'col-6';
      }
      break; 
      case 'but': {
        normal = 'col-1';
        width < 1280 ? small = 'col-2': small = 'col-1';
      } 
    }
    return width <= 1600 ? small : normal; 
  }
  
  ngOnInit(): void {
   }

  linkBack(event: any) {
    switch(this.activRoutePath) {
      default:
      case 'bookshelf': {
        this.route.navigateByUrl('/bookshelf');
      }
      break;
      case 'uservewed': {
        this.route.navigateByUrl('/usercabinet/user-cabinet-viewed');
      }
      break;
      case 'userbooked': {
        this.route.navigateByUrl('/usercabinet/user-cabinet-booked');
      }
      break;
    }
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
  }
}

