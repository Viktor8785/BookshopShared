import { Component, OnInit } from '@angular/core';
import { EmitService } from 'src/app/shared/emit.service';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { filter, Subscription} from 'rxjs';
import { UserBooksModel } from 'src/app/users/model/user.books.model';
import { AuthService } from 'src/app/shared/auth.service';
import { DatabaseService } from '../../../shared/database.service';

@Component({
  selector: 'app-user-cabinet-viewed',
  templateUrl: './user.cabinet.viewed.component.html',
  styleUrls: ['./user.cabinet.viewed.component.css']
})
export class UserCabinetViewedComponent implements OnInit {
  private booksPerPage = 22;
  private selectedPage!:number;
  public totalPages!: number;
  public nextDisabled = false;
  public prevDisabled = false;
  private subscr!: Subscription;
  private subscr2!: Subscription;
  private subscr3!: Subscription;
  public userBooks: UserBooksModel[] = [];
    
  constructor(activRoute: ActivatedRoute,
    private router: Router,
    private emitService: EmitService,
    private dbService: DatabaseService,
    private authService: AuthService
  ) {
    this.subscr = router.events.pipe(filter((e: any) => e instanceof NavigationStart)).subscribe((e: any) => {
      if(e.url.startsWith('/bookdetail')) {
        this.saveParams();
      };
    });
    this.authService.authState();
    if(typeof this.authService.userDataId !== undefined) {
      this.getUserBooks(this.authService.userDataId);
    }
    this.subscr = this.emitService.getAuthState().subscribe((userId: string) => {
      this.getUserBooks(userId);
    });
  };

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
    this.emitService.saveUserBooksData(this.selectedPage);
  }

  getParams(): boolean {
    const selectedPage = this.emitService.getUserBooksSelectedPage();
    if( typeof(selectedPage) != 'undefined') {
      this.selectedPage = selectedPage;
      return true;
    }
    else {
      this.selectedPage = 1;
      return false;
    }
  }
 
  getUserBooks(userId: string) {
    if(userId) {
      this.subscr2 = this.dbService.getUserBooksDatas(userId).subscribe((books: UserBooksModel[]) => {
        this.userBooks = books;
        this.totalPages = Math.ceil(this.userBooks.length / this.booksPerPage);
      });
    };
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

  ngOnDestroy() {
    this.saveParams();
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
