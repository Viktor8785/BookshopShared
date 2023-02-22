import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Subscription} from 'rxjs';
import { EmitService } from 'src/app/shared/emit.service';
import { DatabaseService } from 'src/app/shared/database.service';
import { UserBooksModel } from 'src/app/users/model/user.books.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userblock',
  templateUrl: './userblock.component.html',
  styleUrls: ['./userblock.component.css']
})
export class UserblockComponent implements OnInit {
  userId = '';
  userBlocked = false;
  userBlockedShow = 0;
  reservedNumber = '';
  viewedNumber = '';
  orderedNumber = '';
  subscr!: Subscription;
  subscr2!: Subscription;
  subscr3!: Subscription;

  constructor(
    private authService: AuthService,
    private emitService: EmitService,
    private dbService: DatabaseService
  ) {
    this.authService.authState();
    if(this.authService.userDataId) {
      this.getUserDataBooksDatas(this.authService.userDataId);
    };
    this.subscr = this.emitService.getAuthState().subscribe((userId: string) => {
      this.getUserDataBooksDatas(userId);
    });
   }

   getUserDataBooksDatas(userId: string) {
    if(userId && this.isLoggedIn) {
      this.userId = userId;
      if(!this.subscr2 || this.subscr2.closed) {
        this.subscr2 = this.dbService.getUserBooksDatas(this.userId).subscribe((books: UserBooksModel[]) => {
          this.reservedNumber = String(books.filter((book) => book.reserved).length);
          this.viewedNumber = String(books.length);
          this.orderedNumber = String(books.filter((book) => book.ordered).length);
        });
      };
      if(!this.subscr3 || this.subscr3.closed) {
        this.subscr3 = this.dbService.getUserData(this.userId).subscribe(user => {
          this.userBlocked = user.userBlocked as boolean;
          this.userBlockedShow = 1;
          if(this.userBlocked) {
            this.userBlockedShow = -1;
          }
        });
      }
    } else {
        this.userBlocked = false;
        this.userBlockedShow = 0;
        this.userId = '';
        this.reservedNumber = '';
        this.viewedNumber = '';
        this.orderedNumber = '';
        if(this.subscr2) {
          this.subscr2.unsubscribe();
        }
        if(this.subscr3) {
          this.subscr3.unsubscribe();
        }
    };
   }
   
   get userName() {
    if(this.isLoggedIn) {
      return this.shrinkText(this.authService.userData.displayName, 6, 1600);
    }
    return '';
  }
  
  shrinkText(text: string, length: number, width: number) {
    const widthValue = document.documentElement.clientWidth;
    return (text.length > length && widthValue <= width) ? text.slice(0,length - 1) + '\u2026' : text;
  }
  
  get isLoggedIn() {
    return this.authService.isLoggedIn;
  } 
  
  signOut(event: any) {
    this.authService.signOut();
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
