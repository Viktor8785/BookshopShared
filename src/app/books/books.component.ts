import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EmitService } from '../shared/emit.service';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  text1 = 'Total books founded:';
  text2 = 'Current offset:';
  text3 = 'Total pages in this offset:';
  text4 = 'Current page in this offset:';
  bookshelfTotalDataLength = 0;
  bookshelfTotalPages = 0;
  bookshelfCurrentPage = 0;
  bookshelfCurrentOffset = 0;
  subscr!: Subscription;
  subscr2!: Subscription;
  subscr3!: Subscription;
  subscr4!: Subscription;
  subscr5!: Subscription;

  constructor(private emitService: EmitService,
              private authService: AuthService
  ) { }
  
 
  ngOnInit(): void {
    this.subscr = this.emitService.getBookshelfTotalDataLength().subscribe(length => this.bookshelfTotalDataLength = length);
    this.subscr2 = this.emitService.getBookshelfTotalPages().subscribe(pages => this.bookshelfTotalPages = pages);
    this.subscr3 = this.emitService.getBookshelfCurrentPage().subscribe(page => this.bookshelfCurrentPage = page);
    this.subscr4 = this.emitService.getBookshelfCurrentOffset().subscribe( offset => this.bookshelfCurrentOffset = offset);
  }

  shrinkText(text: string, length: number, width: number) {
    const widthValue = document.documentElement.clientWidth;
    return (text.length > length && widthValue <= width) ? text.slice(0,length - 1) + '\u2026' : text;
  }
  
  getClasses(value: string): string {
    const width = document.documentElement.clientWidth;
    let normal = '';
    let small = '';
    switch(value) {
      default:
      case 'cap': {
        normal = 'caption';
        small = 'caption-small';
        this.isAdmin ? normal += ' col-4' : normal += ' col-6';
      }
      break;
      case 'but': {
        normal = 'btn-lg';
        small = 'btn-sm';
      }
    }
    return width <= 1600 ? small : normal; 
  }

  get isAdmin() {
    return this.authService.isAdmin;
  }
  
  ngOnDestroy(): void {
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