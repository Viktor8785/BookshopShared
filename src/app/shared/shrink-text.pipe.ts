import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shrinkText'
})
export class ShrinkTextPipe implements PipeTransform {

  transform(value: string, length: number, token: string): string {
    const width = document.documentElement.clientWidth;
    switch(token) {
      default:
      case 'title': {
        return value.length > 25 ? value.slice(0, 22) + "\u2026" : value;
      };
      break;
      case 'text': {
        return (value.length > length && width <= 1600) ? value.slice(0, length) + "\u2026" : value;
      };
      break;
    }
  }
}
