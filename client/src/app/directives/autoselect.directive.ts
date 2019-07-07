import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAutoselect]'
})
export class AutoselectDirective {

  constructor(
    private el: ElementRef
  ) {}

  @HostListener('focus') onFocus() {
    this.el.nativeElement.select()
  }
}
