import { Component, OnInit } from '@angular/core';
import { BookSearch } from './booksearch.model';
import { NgForm } from '@angular/forms';
import { EmitService } from '../../shared/emit.service';
import { EventData } from 'src/app/shared/event.model';

@Component({
  selector: 'app-booksearch',
  templateUrl: './booksearch.component.html',
  styleUrls: ['./booksearch.component.css']
})
export class BooksearchComponent implements OnInit {
  
  bookSearch: BookSearch = new BookSearch('', '', '');
  text1 = 'Author Name';

  constructor(private emitService: EmitService ) { }

  resetBookSearchForm() {
    this.bookSearch = new BookSearch('', '', '');
  }

  submitBookSearchForm(form: NgForm) {
    if (form.valid) {
      let bookSearchQuery: string = 'language:eng';
      this.bookSearch.title ? bookSearchQuery += ' title:' + this.bookSearch.title : bookSearchQuery;
      this.bookSearch.authorName ? bookSearchQuery += ' author:' + this.bookSearch.authorName : bookSearchQuery;
      this.bookSearch.query ? bookSearchQuery += ' subject:' + this.bookSearch.query : bookSearchQuery;
      this.emitService.emitEvent(new EventData('search', bookSearchQuery));
    }
  }
  
  ngOnInit(): void {
    this.bookSearch = new BookSearch('', '', '');
  }

}
