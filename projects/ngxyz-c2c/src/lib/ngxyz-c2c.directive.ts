import {Directive, ElementRef, HostListener, Input, NgZone, OnChanges} from '@angular/core';
import {NgxyzC2cService} from './ngxyz-c2c.service';

/**
 * Clicking the Host Element copies it's innerText into clipboard.
 */

@Directive({
  selector: '[libNgxyzC2c], [libNgxyzC2C], [ngxyzC2c], [ngxyzC2C]'
})
export class NgxyzC2cDirective implements OnChanges {
  // tslint:disable-next-line:no-input-rename
  @Input('libNgxyzC2c') options: NgxyzC2cOptions;
  @Input() libNgxyzC2C: NgxyzC2cOptions;
  @Input() ngxyzC2c: NgxyzC2cOptions;
  @Input() ngxyzC2C: NgxyzC2cOptions;

  constructor(private elRef: ElementRef, private ngZone: NgZone, private ngxyzC2cService: NgxyzC2cService) {
  }

  ngOnChanges(): void {
    this.ngZone.runOutsideAngular(() => {
      this.options = this.options || this.libNgxyzC2C || this.ngxyzC2c || this.ngxyzC2C;
    });
  }

  @HostListener('click')
  copyInnerTextToClipboard(): void {
    this.ngxyzC2cService.copyInnerTextToClipboard(this.elRef.nativeElement, this.options);
  }
}
