import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAutoSelect]'
})
export class AutoSelectDirective {

  constructor(
    private el: ElementRef
  ) {}

  @HostListener('focus') onFocus() {
    this.el.nativeElement.select()
  }
}
