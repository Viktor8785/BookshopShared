import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Books } from './books.model';
import { BooksModel } from './repository.books.model';
import { HttpParams } from '@angular/common/http';
import { EmitService } from '../../shared/emit.service';
import { BookSearch } from '../booksearch/booksearch.model';
import { EventData } from 'src/app/shared/event.model';
import { Router, NavigationStart } from '@angular/router';
import { filter, Subscription} from 'rxjs';

@Component({
  selector: 'app-bookshelf',
  templateUrl: './bookshelf.component.html',
  styleUrls: ['./bookshelf.component.css']
})
export class BookshelfComponent implements OnInit {
  public modalMess: boolean = false;
  private booksPerPage = 22;
  private selectedPage!:number;
  public totalPages!: number;
  private offset!: number;
  private limit = 200;
  private query: string = 'language:eng';
  public totalDataLength = 0;
  public nextDisabled = false;
  public prevDisabled = false;
  private subscr!: Subscription;
  private subscr2!: Subscription;
  private subscr3!: Subscription;
  private subscrSearch!: Subscription;
  private subscrError: Subscription;
  private errorMess1: string = 'Loading data...';
  private errorMess2: string ='Failed to load data';
  public errorMess = this.errorMess1;
  public failedLoad = false;
  private bookSearch!: BookSearch;
  private booksUrl: string = 'https://openlibrary.org/search.json';
    
  constructor(
    router: Router,
    private booksModel:BooksModel,
    private emitService: EmitService,
    private ref: ChangeDetectorRef
  ) {
      this.subscr3 = router.events.pipe(filter((e: any) => e instanceof NavigationStart)).subscribe((e: any) => {
        if(e.url.startsWith('/bookdetail')) {
          this.saveParams();
        };
      });
      this.subscr2 = this.emitService.getEmitter().subscribe((event: EventData) => {
        if ( event.name == 'search') {
          if(event.body) {
            this.getSearchData(event.body, 1);
          }
        }
      });
      this.subscrError = this.emitService.getError().subscribe((error: string) => {
        this.errorMess = this.errorMess2;
        this.failedLoad = true;
        this.ref.detectChanges();
      });
    };

  getBooks(): Books[]{
    let pageIndex = (this.selectedPage - 1) * this.booksPerPage;
    let books: Books[] = this.booksModel.getBooks();
    return books.slice(pageIndex, pageIndex + this.booksPerPage);
  }

  changePage(dir: string) {
    switch (dir) {
      default:
      case 'next': {
        this.prevDisabled = false;
        if(this.selectedPage == this.totalPages) {
          if(this.totalDataLength > (this.offset + this.limit)) {
            this.moveNextOffset(dir);
          }
          else {
            this.nextDisabled = true;
          }
        }
        else {
          this.selectedPage++;
          this.emitService.emitBookshelfCurrentPage(this.selectedPage);
        }
      }
      break;
      case 'prev': {
        this.nextDisabled = false;
        if(this.selectedPage == 1) {
          if(this.offset >= this.limit) {
            this.moveNextOffset(dir);
          }
          else {
            this.prevDisabled = true;
          }
        }
        else {
          this.selectedPage--;
          this.emitService.emitBookshelfCurrentPage(this.selectedPage);
        }
      }
      break;
    }
  }

  moveNextOffset(dir: string) {
    this.modalMess = true;
    this.prevDisabled = this.nextDisabled = true;
    this.getNewOffsetData(dir);
    this.subscr = this.emitService.getEmitter().subscribe((event: EventData) => {
      if( event.name == 'book') {
        this.failedLoad = false;
        this.totalPages = this.getTotalPages();
        this.emitService.emitBookshelfTotalPages(this.totalPages);
        switch (dir) {
          default:
          case 'prev': {
            this.selectedPage = this.totalPages;
            this.emitService.emitBookshelfCurrentPage(this.selectedPage);
          };
          break;
          case 'next': {
            this.selectedPage = 1;
            this.emitService.emitBookshelfCurrentPage(this.selectedPage);
          }
        }
        this.modalMess = false;
        this.prevDisabled = this.nextDisabled = false;
        this.ref.detectChanges();
      };
      this.subscr.unsubscribe();
    });
  }
  
  getNewOffsetData(dir: string) {
    dir == "next" ? this.offset+= this.limit : this.offset-= this.limit;
    this.emitService.emitBookshelfCurrentOffset(this.offset);
    this.booksModel.getData(this.booksUrl, this.setHttpParams());
  }
  
  setHttpParams() {
    return new HttpParams({fromObject:{
      ['q']: this.query,
      ['fields']: 'isbn,title,author_name,cover_i,key',
      ['offset']: this.offset,
      ['limit']: this.limit
    }})
  }
  
  getLength() {
    return this.booksModel.getTotalLength();
  }
  
  getTotalPages(): number {
    return Math.ceil(this.booksModel.getBooksFilteredLength() / this.booksPerPage);
  }
  
  getSearchData(q: string, selectedPage: number) {
    this.offset = 0;
    this.query = q;
    this.selectedPage = selectedPage;
    this.emitService.emitBookshelfCurrentPage(this.selectedPage);
    this.modalMess = true;
    this.prevDisabled = this.nextDisabled = true;
    this.booksModel.getData(this.booksUrl, this.setHttpParams());
    this.subscrSearch = this.emitService.getEmitter().subscribe((event: EventData) => {
      if ( event.name == 'book') {
        this.failedLoad = false;
        this.modalMess = false;
        this.prevDisabled = this.nextDisabled = false;
        this.totalPages = this.getTotalPages();
        this.totalDataLength = this.getLength();
        this.emitService.emitBookshelfTotalPages(this.totalPages);
        this.emitService.emitBookshelfTotalDataLength(this.totalDataLength);
        this.emitService.emitBookshelfCurrentPage(this.selectedPage);
        this.emitService.emitBookshelfCurrentOffset(this.offset);
        this.ref.detectChanges();
      };
      this.subscrSearch.unsubscribe();
    });
  }

  saveParams(): void {
    this.emitService.saveData(this.selectedPage, this.totalPages, this.offset, this.totalDataLength);
  }
  
  getParams(): boolean {
    const selectedPage = this.emitService.getSelectedPage();
    const totalPages = this.emitService.getTotalPages();
    const offset = this.emitService.getOffset();
    const totalDataLength = this.emitService.getTotalDataLength();
    if(typeof(selectedPage) != 'undefined' && 
      typeof(totalPages) != 'undefined' && 
      typeof(offset) != 'undefined' && 
      typeof(totalDataLength) != 'undefined'
    ) {
      this.selectedPage = selectedPage;
      this.emitService.emitBookshelfCurrentPage(this.selectedPage);
      this.totalPages = totalPages;
      this.emitService.emitBookshelfTotalPages(this.totalPages);
      this.offset = offset;
      this.emitService.emitBookshelfCurrentOffset(this.offset);
      this.totalDataLength = totalDataLength;
      this.emitService.emitBookshelfTotalDataLength(this.totalDataLength);
      return true;
    }
    else {
      this.selectedPage = 1;
      this.emitService.emitBookshelfCurrentPage(this.selectedPage);
      this.offset = 0;
      return false;
    }
  }

  getClasses(value: string): string {
    const width = document.documentElement.clientWidth;
    let small = '';
    let normal = '';
    switch(value) {
      default:
      case 'modal': {
        small = 'modal-mess-body-small';
        normal = 'modal-mess-body';
      };
      break;
    }
    return width <= 1600 ? small : normal;
  }
  
  repeatLoading() {
    this.errorMess = this.errorMess1;
    this.ref.detectChanges();
    this.booksModel.getData(this.booksUrl, this.setHttpParams());
  }

  stopLoading() {
    this.modalMess = false;
    this.errorMess = this.errorMess1;
    this.ref.detectChanges();
  }

  ngOnInit(): void {
    if(!this.getParams()) {
      this.getSearchData('language:eng', this.selectedPage);
    }
  }

  ngOnDestroy() {
    this.saveParams();
    if(this.subscr) {
      this.subscr.unsubscribe();
    };
    if(this.subscr2) {
      this.subscr2.unsubscribe();
    };
    if(this.subscr2) {
      this.subscr2.unsubscribe();
    };
    if(this.subscrError) {
      this.subscrError.unsubscribe();
    };
    if(this.subscrSearch) {
      this.subscrSearch.unsubscribe();
    };
  }

}
