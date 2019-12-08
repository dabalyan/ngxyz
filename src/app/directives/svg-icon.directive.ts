import {AfterViewInit, Directive, ElementRef, HostBinding, Input, OnChanges} from '@angular/core';

@Directive({
  selector: '[appSvgIcon]'
})
export class SvgIconDirective implements OnChanges, AfterViewInit {

  @Input('appSvgIcon') icon: string;
  @Input() svgSize: string;
  @Input() svgFile = 'assets/icons.svg';

  @HostBinding('style.display') hostDisplay = 'inline-block';
  @HostBinding('style.vertical-align') hostVerticalAlign = 'middle';

  constructor(private elRef: ElementRef) {
  }

  ngOnChanges(): void {
    this.applySvgSymbol();
  }

  ngAfterViewInit() {
    this.applySvgSymbol();
  }

  applySvgSymbol(afterViewInit?: boolean) {
    if (!this.elRef || !this.elRef.nativeElement) {
      return;
    }
    if (afterViewInit) {
      this.elRef.nativeElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    this.elRef.nativeElement.setAttribute('width', this.svgSize);
    this.elRef.nativeElement.setAttribute('height', this.svgSize);
    this.elRef.nativeElement.innerHTML = `<use xlink:href="${this.svgFile + '#' + this.icon}"></use>`;
  }
}
