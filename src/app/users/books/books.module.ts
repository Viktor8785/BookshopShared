import { NgModule, ErrorHandler  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BookshelfComponent } from './bookshelf/bookshelf.component';
import { RestBooksSource } from './bookshelf/rest.books.source';
import { BooksModel } from './bookshelf/repository.books.model';
import { BookDetailModel } from './bookdetail/repository.bookDetail.model';
import { BooksearchComponent } from './booksearch/booksearch.component';
import { RouterModule } from '@angular/router';
import { BooksComponent } from './books.component';
import { FormsModule } from '@angular/forms';
import { BookdetailComponent } from './bookdetail/bookdetail.component';
import { ErrorHandlerService } from '../shared/error-handler.service';
import { UsersModule } from '../users/users.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    BookshelfComponent,
    BooksearchComponent,
    BooksComponent,
    BookdetailComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    UsersModule,
    SharedModule
  ],
  providers: [
    RestBooksSource, BooksModel, BookDetailModel,
    { provide: ErrorHandler, useClass: ErrorHandlerService }
  ],
  exports: [
    BookshelfComponent,
    BooksearchComponent,
    BooksComponent,
    BookdetailComponent,
  ]
})
export class BooksModule { }
