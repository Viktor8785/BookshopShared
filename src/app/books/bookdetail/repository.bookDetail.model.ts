import { BookDetail } from './bookDetail.model';
import { RestBooksSource } from '../bookshelf/rest.books.source';
import { Injectable, Input } from "@angular/core";
import { HttpEventType, HttpParams } from '@angular/common/http';
import { EmitService } from '../../shared/emit.service';
import { Subscription } from 'rxjs';

@Injectable()
export class BookDetailModel {
  private bookDetail: BookDetail = new BookDetail(null, null, null, null, null, null);
  private subscr!: Subscription;

  constructor(private booksSource: RestBooksSource, private emitService: EmitService) { }
  
  getData(url: string, params: HttpParams): void {
    this.booksSource.urlReq = url;
    this.booksSource.params = params;
    this.subscr = this.booksSource.getData().subscribe((event: any) => {
      if(event.type === HttpEventType.Response) {
        let data = event.body;
        this.bookDetail = new BookDetail(null, null, null, null, null, null);
        this.bookDetail = new BookDetail(
                data.subject_places ? data.subject_places : null,
                data.subjects ? data.subjects : null,
                data.subject_people ? data.subject_people : null,
                data.subject_times ? data.subject_times : null,
                data.description ? data.description : null,
                data.first_sentence ? data.first_sentence : null
        );
      } 
    });
  }

  getBookDetail(): BookDetail {
    return this.bookDetail;
  }

  /*ngOnDestroy() {
    this.subscr.unsubscribe;
  }*/

}