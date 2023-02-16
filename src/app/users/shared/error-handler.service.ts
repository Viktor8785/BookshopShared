import { ErrorHandler, Injectable } from '@angular/core';
import { EmitService } from './emit.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService  implements ErrorHandler{
  
  public booksError = '';
  
  constructor(private emitService: EmitService) { }

  handleError(error: any) {
    let msg: string = error instanceof Error ? error.message : error.toString();
    this.emitService.emitError(msg);
    console.log(msg);
    if(msg.includes('openlibrary')) {
      this.booksError = msg;
    }
    }
}
