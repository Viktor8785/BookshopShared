import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmitService } from 'src/app/shared/emit.service';

@Component({
  selector: 'app-error-message',
  templateUrl: './error.message.component.html',
  styleUrls: ['./error.message.component.css']
})
export class ErrorMessageComponent implements OnInit {
  public errorMess = '';
  private linkBack: null|string = null;
  public errorMessColor = '';
  
  constructor(private router: Router, private emitService: EmitService) {
    this.errorMess = emitService.getErrorMessage();
    this.linkBack = emitService.getLinkBack();
    this.errorMessColor = this.emitService.getErrorMessColor();
   }

  closePopup() {
    this.router.navigate([{outlets: {popup: null}}]);
    this.emitService.saveErrorMessColor('');
    if(this.linkBack) {
      this.emitService.saveLinkBack(null);
      this.router.navigateByUrl(this.linkBack);
    };
  }
  
  getClasses(token: string): string {
    const width = document.documentElement.clientWidth;
    switch (token) {
      default:
      case 'doc': {
       return width <= 1600 ? 'user-entry-body-mess-small' : 'user-entry-body-mess';  
      };
      break;
      case 'text': {
        return this.errorMessColor;
      };
      break;  
    }
  }
  
  ngOnInit(): void {
  }

}
