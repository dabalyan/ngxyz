import {Injectable} from '@angular/core';
import {fromEvent, Observable, Subject} from 'rxjs';

import {DynamicComponentLoader} from './dynamic-loader.service';
import {NgxyzKonamiComponent} from './ngxyz-konami.component';

/**
 * Inspired by original Konami Cheat Codes
 * This is a Service which listens to Keyboard.keydown events and triggers a cheat (callback function) if the cheat code matched with
 * what was entered by the user.
 *
 * You can also use it to Show/Hide features in your production website.
 * You can use localstorage in combination and preserve the state of Showing/Hiding that feature, once revealed.
 */

@Injectable({
  providedIn: 'root'
})
export class NgxyzKonamiService {
  /**
   * Flag to enable/disable KonamiService.
   * By default KonamiService is enabled, if isEnabled is not set to false manually or Activation code is not provided.
   * If set to false, cheats won't get triggered, except Activation and Deactivation cheats if activationCode or deactivationCode were
   * provided respectively.
   */
  isEnabled = true;
  /**
   * Flag to enable logging NgxyzKonamiEvent events to the browser console. You will probably want to use it for debugging.
   */
  logEvents = false;
  /**
   * Flag to enable message-dialogues, for the cheats that were registered with a message.
   * KonamiService includes a built in message-dialog, if showMessages is set to true and a message was provided with the cheat code,
   * it'll be shown for 3 seconds by default, you can pass messageTimeout to override that when registering the cheat.
   */
  showMessages = true;
  /**
   * Flag to ignore whether the keydown event's target is form or form-like.
   * By default cheats don't get triggered when a form element like input is event.target/focused, this is to prevent accidental and
   * surprise triggers, you can disable this behavior setting ignoreFormElements to true.
   */
  ignoreFormElements = false;

  /**
   * All the available/registered cheats.
   */
  private readonly cheats: Map<string, NgxyzKonamiCheat> = new Map();
  /**
   * Array of codes for all the registered cheats, for easy lookup and verification.
   */
  private cheatCodes: Array<string> = [];
  /**
   * User entered code, updated on every key stroke, which is matched against the registered cheatCodes.
   */
  private enteredCode = '';
  /**
   * A special cheat code to enable the KonamiService for other registered cheats.
   */
  private activationCode: string;
  /**
   * A special cheat code to disable the KonamiService for other registered cheats.
   */
  private deactivationCode: string;

  /**
   * Subject to emit NgxyzKonamiEvents ACTIVATION, DEACTIVATION, CHEAT_TRIGGERED
   */
  private readonly eventsSubject: Subject<NgxyzKonamiEvent> = new Subject<NgxyzKonamiEvent>();
  /**
   * An observable which you can listen to for NgxyzKonamiEvents ACTIVATION, DEACTIVATION, CHEAT_TRIGGERED
   * type: 'ACTIVATION' means that the KonamiService got enabled, and other cheats will work now.
   * type: 'DEACTIVATION' means that the KonamiService got disabled, and other cheats will not work now.
   * type: 'CHEAT_TRIGGERED' means a cheat got triggered, other than special cheats ACTIVATION and DEACTIVATION.
   */
  readonly events: Observable<NgxyzKonamiEvent> = this.eventsSubject.asObservable();

  constructor(private dynamicLoader: DynamicComponentLoader) {
    this.initialize();
  }

  /**
   * Register a keydown listener for KonamiService to work.
   */
  private initialize() {
    fromEvent(document, 'keydown').subscribe((event: KeyboardEvent) => this.onKeydown(event));
  }

  /**
   * Records the code entered by the user, checks it against registered codes, resets it if no code matched,
   * restarts it if a code partially matched. Asks triggerCheat method to trigger the cheat if code matched.
   * @param event KeyboardEvent triggered by keydown
   * @param recheck When a cheat code partially matched with the entered code but then abruptly you try to activate another cheat or enter
   * a key that causes the entered cheat code to not match with any available cheat code anymore, we gotta try to recheck if the new
   * entered key matched with any available cheat code. If does match we keep it, otherwise empty the enteredCode for future.
   */
  private onKeydown(event: KeyboardEvent, recheck: boolean = false): void {
    if (!this.ignoreFormElements && this.isFormElement(event.target as HTMLElement)) {
      return;
    }

    const newKey = (event.key || event.code).toLocaleLowerCase();
    this.enteredCode += newKey;

    const matchedCheat: NgxyzKonamiCheat = this.getMatchedCheat();
    if (matchedCheat) {
      this.triggerCheat(matchedCheat);
    } else if (!this.someCheatCodesPartiallyMatch() && !recheck) {
      if (this.enteredCode === newKey) {
        this.enteredCode = '';
      } else {
        this.enteredCode = '';
        this.onKeydown(event, true);
        return;
      }
    }
  }

  /**
   * Triggers a cheat if KonamiService is enabled, or it's the special Activation or Deactivation cheat
   * If triggered, also emits KonamiEvent.
   * @param cheat The cheat that got matched with the entered code and needs to be triggered.
   */
  private triggerCheat(cheat: NgxyzKonamiCheat): void {
    if (this.isEnabled || this.isSpecialCheatCode(cheat.code)) {
      if (typeof cheat.action === 'function') {
        cheat.action(cheat);
      }
      this.eventsSubject.next({
        type: cheat.code === this.activationCode && 'ACTIVATION' || cheat.code === this.deactivationCode && 'DEACTIVATION'
          || 'CHEAT_TRIGGERED',
        cheat
      });
      this.afterCheatTriggered(cheat);
    }
  }

  /**
   * Runs after a cheat gets triggered.
   * logs events to the browser console if allowed by logEvents flag.
   * Shows the message dialog if allowed by showMessages flag, closes the previously shown message dialog and destroys it's host DLC.
   * @param cheat The cheat that got triggered.
   */
  private afterCheatTriggered(cheat: NgxyzKonamiCheat): void {
    if (this.logEvents) {
      console.log(`[Konami Cheat Triggered]: ${(cheat.name || cheat.code).toUpperCase()}`);
    }
    if (this.showMessages && typeof cheat.message === 'string' && cheat.message.trim()) {
      this.dynamicLoader.detachAndDestroy(NgxyzKonamiComponent);
      setTimeout(() => {
        this.dynamicLoader.appendToBody(NgxyzKonamiComponent, {cheat});
        this.dynamicLoader.detachAndDestroy(NgxyzKonamiComponent, cheat.messageTimeout || 3000);
      }, 200);
    }
  }

  /**
   * Tries to find a registered cheat that matches with the entered cheat code.
   * @return The matched cheat code, if no match return undefined.
   */
  private getMatchedCheat(): NgxyzKonamiCheat {
    const matchedCode: string = this.cheatCodes.find(code => code === this.enteredCode);
    return matchedCode && this.cheats.get(matchedCode);
  }

  /**
   * Checks if a cheat code matches partially with the entered code, meaning whether at least one cheat code starts with the enter code.
   * @return A boolean indicating whether there is a partial match.
   */
  private someCheatCodesPartiallyMatch(): boolean {
    return this.cheatCodes.some(code => code.indexOf(this.enteredCode) === 0);
  }

  /**
   * Updates the cheatCodes array with the current cheat codes for easy/faster lookup and matching later.
   */
  private updateCheatCodes(): void {
    this.cheatCodes = Array.from(this.cheats.keys());
  }

  /**
   * Checks whether the focused/target Element is a form element or form like eg: an element with editableContent.
   * @param element Target element of the keydown event.
   * @return A boolean indicating whether the Element is a form or form like element.
   */
  private isFormElement(element: HTMLElement): boolean {
    return !!element && (['INPUT', 'SELECT', 'OPTION', 'TEXTAREA', 'BUTTON'].includes(element.nodeName) || element.isContentEditable);
  }

  /**
   * Checks if the entered cheat code qualifies as a special cheat code, which can be triggered regardless of KonamiService being enabled.
   * @param cheatCode Code of the cheat.
   * @return A boolean indicating whether the cheatCode is special or not.
   */
  private isSpecialCheatCode(cheatCode: string): boolean {
    return [this.activationCode, this.deactivationCode].includes(cheatCode);
  }


  /**
   * Optionally configure KonamiService in one go.
   * @param options All the configuration options you want to set or override. You can register all the cheats at once.
   * Remember every time you call it, the options and cheats passed override completely (meaning it's not merged) the current configuration,
   * if an option is not passed it stays as it was.
   */
  configure(options: NgxyzKonamiOptions): void {
    const {
      logEvents, showMessages, ignoreFormElements, activationCode, deactivationCode, cheats
    }: NgxyzKonamiOptions = options || {};

    if (typeof logEvents === 'boolean') {
      this.logEvents = logEvents;
    }

    if (typeof showMessages === 'boolean') {
      this.showMessages = showMessages;
    }

    if (typeof ignoreFormElements === 'boolean') {
      this.ignoreFormElements = ignoreFormElements;
    }

    if (typeof activationCode === 'string' && activationCode.length) {
      this.isEnabled = false;
      this.activationCode = activationCode.toLowerCase();
      this.addCheat({code: this.activationCode, action: this.enable.bind(this)});
    }

    if (typeof deactivationCode === 'string' && deactivationCode.length) {
      this.deactivationCode = deactivationCode.toLowerCase();
      this.addCheat({code: this.deactivationCode, action: this.disable.bind(this)});
    }

    if (cheats instanceof Array && cheats.length) {
      cheats.forEach(cheat => this.addCheat(cheat));
    }
  }

  /**
   * Manually enable the KonamiService.
   * @return Whether the KonamiService got enabled. It's pointless at the moment, it exists only for future proofing.
   */
  enable(): boolean {
    return this.isEnabled = true;
  }

  /**
   * Manually disable the KonamiService.
   * @return Whether the KonamiService got disabled. It's pointless at the moment, it exists only for future proofing.
   */
  disable(): boolean {
    return this.isEnabled = false;
  }

  /**
   * Register a cheat. It will override an already registered cheat with the same cheat.code
   * @param cheat A KonamiCheat
   * @return A boolean indicating whether the cheat was successfully registered or not
   */
  addCheat(cheat: NgxyzKonamiCheat): boolean {
    if (!cheat || typeof cheat.code !== 'string' || !cheat.code.length || this.isSpecialCheatCode(cheat.code)
      || (typeof cheat.action !== 'function' && typeof cheat.message !== 'string')) {
      return false;
    }
    cheat.code = cheat.code.toLowerCase();
    this.cheats.set(cheat.code, cheat);
    this.updateCheatCodes();
    return true;
  }

  /**
   * Given a cheat code returns the originally registered cheat with the matched cheat.code
   * @param code The cheat.code of a registered cheat
   * @return The matched cheat otherwise undefined
   */
  getCheat(code: string): NgxyzKonamiCheat {
    if (typeof code === 'string' && code.length) {
      return this.cheats.get(code.toLowerCase());
    }
  }

  /**
   * Given a cheat code deregister/removes a cheat from the KonamiService
   * @param code The cheat.code of a registered cheat
   * @return A boolean indicating whether the cheat was successfully de-registered/removed or not
   */
  removeCheat(code: string): boolean {
    if (typeof code === 'string' && code.length) {
      this.cheats.delete(code.toLowerCase());
      this.updateCheatCodes();
      return true;
    }
    return false;
  }

  /**
   * De-register/remove all the registered cheats at once.
   */
  clearCheats(): void {
    this.cheats.clear();
    this.updateCheatCodes();
  }
}
