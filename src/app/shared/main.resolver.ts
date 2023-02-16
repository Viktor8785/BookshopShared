import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class mainResolver implements Resolve<boolean> {

  resolve(): Observable<boolean> {
    const height = document.documentElement.clientHeight;
    const width = document.documentElement.clientWidth;
    if (height < 600 || width < 1000) {
      alert('Screen width and height are too small');
      return EMPTY;
    }
    return of(true);
  }
}
