import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAutoselect]'
})
export class AutoselectDirective {
  private selected: boolean = false

  constructor(
    private el: ElementRef
  ) {}

  @HostListener('click') onclick() {
    if (this.selected) return
    this.selected = true
    this.select()
  }

  @HostListener('blur') onBlur() {
    this.selected = false
  }

  private select() {
    this.el.nativeElement.select()
  }
}
