import { Component, OnInit } from '@angular/core';
import { EmitService } from 'src/app/shared/emit.service';
import { Router, NavigationStart } from '@angular/router';
import { filter, Subscription} from 'rxjs';
import { UserBooksModel } from 'src/app/users/model/user.books.model';
import { AuthService } from 'src/app/shared/auth.service';
import { DatabaseService } from '../../../shared/database.service';
import { BooksOrderedModel } from '../../../model/books.ordered.model';

@Component({
  selector: 'app-user-cabinet-booked',
  templateUrl: './user.cabinet.booked.component.html',
  styleUrls: ['./user.cabinet.booked.component.css']
})
export class UserCabinetBookedComponent implements OnInit {
  private booksPerPage = 22;
  private selectedPage!:number;
  public totalPages!: number;
  public nextDisabled = false;
  public prevDisabled = false;
  private subscr!: Subscription;
  private subscr2!: Subscription;
  private subscr3!: Subscription;
  private subscr4!: Subscription; 
  private subscr5!: Subscription; 
  private subscr6!: Subscription; 
  public userBooks: UserBooksModel[] = [];
  public booksOrdered: BooksOrderedModel[] = [];
  private userId = '';
    
  constructor(
    private router: Router,
    private emitService: EmitService,
    private authService: AuthService,
    private dbService: DatabaseService
  ) {
    this.subscr2 = router.events.pipe(filter((e: any) => e instanceof NavigationStart)).subscribe((e: any) => {
      if(e.url.startsWith('/bookdetail')) {
        this.saveParams();
      };
    });
    this.authService.authState();
    if(this.authService.userDataId) {
      this.getUserBooksOrders(this.authService.userDataId);
    }
    this.subscr = this.emitService.getAuthState().subscribe((userId: string) => {
      this.getUserBooksOrders(userId);
    });
  };

  deleteBook(bookId: string) {
    this.subscr = this.dbService.updateUserBooksDataReserved(
      this.userId,
      bookId,
      true
    ).subscribe();
  }
  
  getBooks(): UserBooksModel[] {
    const pageIndex = (this.selectedPage - 1) * this.booksPerPage;
    return this.userBooks.slice(pageIndex, pageIndex + this.booksPerPage);
  }

  changePage(dir: string) {
    switch (dir) {
      default:
      case 'next': {
        this.prevDisabled = false;
        if(this.selectedPage == this.totalPages) {
          this.nextDisabled = true;
        }
        else {
          this.selectedPage++;
        }
      }
      break;
      case 'prev': {
        this.nextDisabled = false;
        if(this.selectedPage == 1) {
          this.prevDisabled = true;
        }
        else {
          this.selectedPage--;
        }
      }
      break;
    }
  }
  
  saveParams(): void {
    this.emitService.saveUserBookedBooksData(this.selectedPage);
  }

  getParams() {
    const selectedPage = this.emitService.getUserBookedBooksSelectedPage();
    if( typeof(selectedPage) != 'undefined') {
      this.selectedPage = selectedPage;
     }
    else {
      this.selectedPage = 1;
    }
  }
 
  getFilteredBooks(books: UserBooksModel[]) {
    return books.filter((book: UserBooksModel) => book.reserved);
  }

  getUserBooksOrders(userId: string) {
    if(userId) {
      this.emitService.emitShowButtonMakeOrder('booked');
      this.userId = userId;
      this.subscr3 = this.dbService.getUserBooksDatas(this.userId).subscribe((userBooks: UserBooksModel[]) => {
        const filteredBooks = this.getFilteredBooks(userBooks);
        this.totalPages = Math.ceil(filteredBooks.length / this.booksPerPage);
        this.userBooks = filteredBooks;
        this.isBooksAllowed();
      });
    };
  }
  
  isBooksAllowed() {
    if(!this.subscr5) {
      this.subscr5 = this.dbService.getBooksOrdered().subscribe((booksOrdered: BooksOrderedModel[]) => {
        this.userBooks.forEach((book: UserBooksModel, index) => {
          if(booksOrdered.map((item) => item.bookId).includes(book.bookId)) {
            this.userBooks[index].allowed = false;
          } else {
            this.userBooks[index].allowed = true;
          }
          this.updateUserBooksAllowed(index);
        })
        this.subscr5.unsubscribe();
      });
    }
  }
  
  updateUserBooksAllowed(index: number) {
    this.subscr6 = this.dbService.updateUserBooksDataAllowed(
      this.userId,
      this.userBooks[index].bookId,
      this.userBooks[index].allowed
    ).subscribe();
  }
  
  getHeight(): any {
    const height = document.documentElement.clientHeight;
    const width = document.documentElement.clientWidth;
    let heightValue = width <= 1600 ? height - 85 : height - 51;
    return {'height':heightValue.toString() + 'px'};
  }
  
  getClasses(): string {
    const width = document.documentElement.clientWidth;
    return width <= 1600 ? 'div-fixed-small' : 'div-fixed'; 
  }
  
  ngOnInit(): void {
    this.getParams();
  }
  
  ngOnDestroy()  {
    this.saveParams();
    this.emitService.emitShowButtonMakeOrder('end');
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
