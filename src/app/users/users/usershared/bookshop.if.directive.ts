import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appBookshopIf]'
})
export class BookshopIfDirective {

  constructor(
    private template: TemplateRef<any>,
    private container: ViewContainerRef
  ) { };
  
  @Input() set appBookshopIf(condition: boolean) {
    if(condition) {
      this.container.createEmbeddedView(this.template);
    } else {
      this.container.clear();
    }
  }
}
