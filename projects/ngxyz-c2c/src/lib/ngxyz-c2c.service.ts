import {Injectable, NgZone} from '@angular/core';

/**
 * A service to copy text into clipboard, either by directly passing the text or by passing a DOM Element reference.
 * NOTE:
 * It only works when accompanied by some user-action eg: click,
 * otherwise browser ignores the copy command, tested in Chrome.
 */

@Injectable({
  providedIn: 'root'
})
export class NgxyzC2cService {
  private readonly copyingAttributeIdentifier = 'libNgxyzCopyingToClipboard';
  private readonly defaultOptions: NgxyzC2cOptions = {animation: true, iconSize: 16, iconColor: '#fff'};
  private options: NgxyzC2cOptions;

  constructor(private ngZone: NgZone) {
    this.configure(null); // configure with default options
  }

  /**
   * Optional configuration, which will be used by any subsequent copyInnerTextToClipboard calls.
   * You can reconfigure it if you want.
   * @param options NgxyzC2cOptions which will be merged with defaultOptions, and will override the matching default options.
   */
  configure(options: NgxyzC2cOptions): void {
    this.options = {...this.defaultOptions, ...options};
  }

  /**
   * Shorthand proxy for copyTextToClipboard and copyInnerTextToClipboard.
   * @param target text or target HTMLElement for copying the text or innerText respectively.
   * @param options NgxyzC2cOptions for copyInnerTextToClipboard, no effect on copyTextToClipboard
   */
  c2c(target: string | HTMLElement, options?: NgxyzC2cOptions): boolean {
    if (typeof target === 'string') {
      return this.copyTextToClipboard(target);
    }
    return this.copyInnerTextToClipboard(target, options);
  }

  /**
   * Given an HTMLElement, select-highlights it's content and copies it's innerText.
   * Animation-less alternative to copyInnerTextToClipboard
   * NOTE: It only works when accompanied by some user-action eg: click
   * @param node Element whose innerText will be copied, if accompanied by some user-action. eg: click
   * @return A boolean indicating whether copying was successful or not.
   */
  executeCopyToClipboardOn(node: HTMLElement): boolean {
    try {
      return this.ngZone.runOutsideAngular(() => {
        const range = document.createRange();
        range.selectNode(node);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        return document.execCommand('copy');
      });
    } catch (e) {
      return false;
    }
  }

  /**
   * Given a string, copies it into clipboard without any visual cue.
   * By default uses global NgxyzC2cOptions. Which can be overridden by passing {options}.
   * NOTE: It only works when accompanied by some user-action eg: click
   * @param text Which will be copied into clipboard, if accompanied by some user-action. eg: click
   * @return A boolean indicating whether copying was successful or not.
   */
  copyTextToClipboard(text: string): boolean {
    try {
      return this.ngZone.runOutsideAngular(() => {
        const tempEl = document.createElement('textarea');
        tempEl.value = text;
        tempEl.setAttribute('readonly', '');
        tempEl.style.position = 'fixed';
        tempEl.style.left = '-100vw';
        tempEl.style.opacity = '0';
        document.body.appendChild(tempEl);
        tempEl.focus();
        tempEl.select();
        setTimeout(() => {
          document.body.removeChild(tempEl); // run after execCommand
        });
        return document.execCommand('copy');
      });
    } catch (e) {
      return false;
    }
  }

  /**
   * Given an HTMLElement, select-highlights it's content and copies it's innerText.
   * Also runs an optional animation by default for visual cue.
   * By default uses global NgxyzC2cOptions. Which can be overridden by passing {options}.
   * NOTE: It only works when accompanied by some user-action eg: click
   * @param hostElement Element whose innerText will be copied, and where copy-animation-icon will be injected while the animation runs,
   * if accompanied by some user-action. eg: click
   * @param options NgxyzC2cOptions
   * @return A boolean indicating whether copying was successful or not.
   */
  copyInnerTextToClipboard(hostElement: HTMLElement, options?: NgxyzC2cOptions): boolean {
    return this.ngZone.runOutsideAngular(() => {
      options = {...this.options, ...options};

      if (!hostElement) {
        return false;
      }

      const isCopyAnimationRunning = hostElement.getAttribute(this.copyingAttributeIdentifier);
      if (isCopyAnimationRunning != null) {
        return false;
      }

      if (!options || options.animation !== false) {
        hostElement.setAttribute(this.copyingAttributeIdentifier, '');
        this.runCopyAnimation(hostElement, options);
      }

      return this.executeCopyToClipboardOn(hostElement);
    });
  }

  /**
   * Animates copy-animation-icon. Then cleans up after itself.
   * Re-allows copying same-element again by removing the animation-running identifier.
   * @param hostElement Host element where copy-animation-icon will be injected while the animation runs.
   * @param options NgxyzC2cOptions
   */
  private runCopyAnimation(hostElement: HTMLElement, options: NgxyzC2cOptions): void {
    const {icon, iconGeometry: {translateToTop}} = this.createIconElement(hostElement, options);
    hostElement.appendChild(icon);

    // start animation
    setTimeout(() => {
      requestAnimationFrame(() => {
        icon.style.opacity = '1';
        icon.style.top = translateToTop + 'px';
      });
    });

    // start fading animation
    setTimeout(() => {
      requestAnimationFrame(() => {
        icon.style.opacity = '0';
      });
    }, 400);

    // cleanup
    setTimeout(() => {
      hostElement.removeChild(icon);
      hostElement.removeAttribute(this.copyingAttributeIdentifier);
    }, 800);
  }

  /**
   * Creates a hidden non-intrusive copy-animation-icon positioned at the top of {hostElement} to highlight the copying.
   * It's used and animated by runCopyAnimation.
   * @param hostElement Host element where copy-animation-icon will be injected while the animation runs.
   * @param options NgxyzC2cOptions
   * @return Created icon and it's positional geometry.
   */
  private createIconElement(hostElement: HTMLElement, options: NgxyzC2cOptions): NgxyzC2cIconAndItsGeometry {
    const hostPosition = hostElement.getBoundingClientRect();
    const icon = document.createElement('span');
    const iconGeometry: NgxyzC2cIconGeometry = {
      left: Math.round(hostPosition.left + hostPosition.width / 2 - options.iconSize / 2),
      top: Math.round(hostPosition.top + hostPosition.height / 2 - options.iconSize),
    };
    iconGeometry.translateToTop = hostPosition.top - options.iconSize - 15;

    Object.assign(icon.style, {
      position: 'fixed',
      left: iconGeometry.left + 'px',
      top: iconGeometry.top + 'px',
      opacity: '0',
      transition: 'top .8s, opacity .4s',
      pointerEvents: 'none',
      zIndex: '9999'
    });
    icon.innerHTML = `<svg width="${options.iconSize}" height="${options.iconSize}" fill="${options.iconColor || '#fff'}"
                      viewBox="0 0 24 24"> <path d="M22 6v16h-16v-16h16zm2-2h-20v20h20v-20zm-24 17v-21h21v2h-19v19h-2z"/> </svg>`;

    return {icon, iconGeometry};
  }
}
