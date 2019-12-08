import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

import {NgxyzKonamiService} from 'ngxyz-konami';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  packages = [
    {
      title: 'Konami Codes',
      name: 'ngxyz-konami',
      version: '0.0.2',
      npmLink: 'https://www.npmjs.com/package/ngxyz-konami',
      githubLink: 'https://github.com/dabalyan/ngxyz/tree/master/projects/ngxyz-konami',
      description: `Add Konami Cheat Codes / Easter-Eggs to your Angular App.<br><br>
        <b>Try It</b><br>
        - Click on this website somewhere.<br>
        - Now just type <i style="color: #00d685">HELLO</i> (don't worry it's case insensitive)<br><br>
        You can trigger any action you want, all you gotta do is provide a code like "HELLO" and a callback.
        <br>A message will also suffice if you don't have a callback.`
    },
    {
      title: 'Oops... that\'s all folks.',
      description: 'Soon there wil be more. Hopefully 🙂'
    }
  ];
  currentPackageIndex = 0;
  currentPackage = this.packages[0];
  animateShutters: boolean;

  @ViewChild('packagePanelBody', {static: false}) packagePanelBody: ElementRef;

  constructor(public domSanitizer: DomSanitizer, private router: Router, private route: ActivatedRoute,
              private konamiService: NgxyzKonamiService) {
    this.konamiService.configure({
      showMessages: true,
      logEvents: true,
      cheats: [
        {
          code: 'hello',
          name: 'Hello',
          message: 'Hello there, Have a nice day 🙂',
          action: () => {
          }
        }
      ]
    });
  }

  ngOnInit(): void {
    // take 2 because first one is just empty, second one contains the actual value
    // TODO: maybe run the packages-slide through router itself
    this.route.fragment.pipe(take(2)).subscribe(fragment => {
      const matchedPackageIndex = typeof fragment === 'string' && this.packages.findIndex(pac => pac.name === fragment);
      if (typeof matchedPackageIndex === 'number' && matchedPackageIndex > -1 && this.currentPackageIndex !== matchedPackageIndex) {
        this.currentPackageIndex = matchedPackageIndex;
        this.currentPackage = this.packages[matchedPackageIndex];
      }
    });
  }

  reflectCurrentPackageInAddressBar(packageName: string) {
    this.router.navigate([], {fragment: packageName, replaceUrl: true}).then(() => {
    }).catch(() => {
    });
  }

  @HostListener('window:keydown.arrowdown')
  nextPackage() {
    if (this.currentPackageIndex === this.packages.length - 1 || this.animateShutters) {
      return;
    }
    this.updateCurrentPackage(true);
  }

  @HostListener('window:keydown.arrowup')
  prevPackage() {
    if (this.currentPackageIndex === 0 || this.animateShutters) {
      return;
    }
    this.updateCurrentPackage(false);
  }

  updateCurrentPackage(nextOrPrev: boolean) {
    this.animateShutters = true;

    setTimeout(() => {
      this.currentPackageIndex += nextOrPrev ? 1 : -1;
      this.currentPackage = this.packages[this.currentPackageIndex];
      this.packagePanelBody.nativeElement.scrollTop = 0;
      this.reflectCurrentPackageInAddressBar(this.currentPackage.name);

      setTimeout(() => {
        this.animateShutters = false;
      }, 100);

    }, 300);
  }
}
