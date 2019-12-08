import {Component, HostListener, ViewEncapsulation} from '@angular/core';
import {DynamicComponentLoader} from './dynamic-loader.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'lib-ngxyz-konami-code',
  template: `
    <div class="cheat-message-container">
      <p class="cheat-message" [innerHTML]="domSanitizer.bypassSecurityTrustHtml(cheat?.message)"></p>
    </div>
  `,
  styleUrls: ['./ngxyz-konami.styles.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NgxyzKonamiComponent {
  cheat: NgxyzKonamiCheat;

  constructor(private dynamicLoader: DynamicComponentLoader, public domSanitizer: DomSanitizer) {
  }

  @HostListener('click')
  @HostListener('window:keydown.escape')
  onClick() {
    this.dynamicLoader.detachAndDestroy(NgxyzKonamiComponent);
  }
}
