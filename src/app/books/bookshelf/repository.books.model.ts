import { Books } from './books.model';
import { RestBooksSource } from './rest.books.source';
import { Injectable } from "@angular/core";
import { HttpEvent, HttpEventType, HttpParams } from '@angular/common/http';
import { EmitService } from '../../shared/emit.service';
import { EventData } from 'src/app/shared/event.model';
import { Subscription } from 'rxjs';

@Injectable()
export class BooksModel {
  private books: Books[] = new Array<Books>();
  public totalDataLength = 0;
  private subscr!: Subscription;

  constructor(private booksSource: RestBooksSource, private emitService: EmitService) { }
  
  getData(url: string, params: HttpParams): void {
    this.booksSource.urlReq = url;
    this.booksSource.params = params;
    this.subscr = this.booksSource.getData().subscribe((event: HttpEvent<any>) => {
      if(event.type === HttpEventType.Response) {
        let data = event.body;
        this.totalDataLength = data.numFound;
        this.books = new Array<Books>();
        data = data.docs.forEach((item: any, index: number) => {
            this.books[index] = new Books(
                item.isbn ? item.isbn[0] : null,
                item.title ? item.title : "",
                item.author_name ? item.author_name[0] : "",
                item.cover_i ? "https://covers.openlibrary.org/b/id/"+item.cover_i+"-M.jpg" : "",
                item.key ? item.key : null
            );
        });
        this.emitService.emitEvent(new EventData('book'));
      }
    });
  }

  getBooks(): Books[] {
    return this.books.filter((books:any) => books.coverId && books.isbn);
  }
  getTotalLength(): number {
    return this.totalDataLength;
  }
  
  getBooksFilteredLength(): number {
    return this.books.filter((books:any) => books.coverId && books.isbn).length;
  }

  ngOnDestroy() {
    this.subscr.unsubscribe();
  }

}