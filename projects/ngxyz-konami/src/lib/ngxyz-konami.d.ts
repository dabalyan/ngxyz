type NgxyzKonamiCheatCallback = (konamiCheat?: NgxyzKonamiCheat) => any;

interface NgxyzKonamiCheat {
  /**
   * A code is a combination of KeyboardEvent.key values (or KeyboardEvent.code in some browsers)
   * These values are case sensitive by themselves, but the KonamiService nullifies the case-sensitivity by converting the code to lowercase
   * So that you can pass the strings in beautiful camelCase, PascalCase or even CAPITALS, for KonamiService it's all lowercase in the end.
   * Which means if your provided code was "HELLO", but then user types "hello", it'll match.
   */
  code: string;
  /**
   * Action is a provided callback function, which will be called with the KonamiCheat (registered cheat) when the cheat gets triggered.
   * One of the action and message is required to register the cheat.
   */
  action?: NgxyzKonamiCheatCallback;
  /**
   * Name is only being used for identifying the logs in the browser console at the moment. You can choose to skip it, cheat.code will
   * be logged in the console instead.
   * It only works if logEvents flag is set to true.
   */
  name?: string;
  /**
   * A message if provided, will be shown to the user as a full screen message-dialog.
   * One of the action and message is required to register the cheat.
   * It works only if showMessages flag is set to true.
   * The message-dialog is shown for 3 seconds by default, you can pass messageTimeout to override it.
   * Message is rendered as HTML. So normal text and HTML both are supported.
   */
  message?: string;
  /**
   * The message-dialog is shown for 3 seconds by default, you can pass messageTimeout to override it.
   * It's in ms by the way. For 5 seconds pass 5000
   */
  messageTimeout?: number;
}

interface NgxyzKonamiOptions {
  /**
   * Flag to enable logging NgxyzKonamiEvent events to the browser console. You will probably want to use it for debugging.
   */
  logEvents?: boolean;
  /**
   * Flag to enable message-dialogues, for the cheats that were registered with a message.
   * KonamiService includes a built in message-dialog, if showMessages is set to true and a message was provided with the cheat code,
   * it'll be shown for 3 seconds by default, you can pass messageTimeout to override that when registering the cheat.
   */
  showMessages?: boolean;
  /**
   * Flag to ignore whether the keydown event's target is form or form-like.
   * By default cheats don't get triggered when a form element like input is event.target/focused, this is to prevent accidental and
   * surprise triggers you can disable this behavior setting ignoreFormElements to false.
   */
  ignoreFormElements?: boolean;
  /**
   * A special cheat code to enable the KonamiService for other registered cheats.
   */
  activationCode?: string;
  /**
   * A special cheat code to disable the KonamiService for other registered cheats.
   */
  deactivationCode?: string;
  /**
   * All the cheats to be registered.
   */
  cheats?: Array<NgxyzKonamiCheat>;
}

type NgxyzKonamiEventType = 'ACTIVATION' | 'DEACTIVATION' | 'CHEAT_TRIGGERED';

interface NgxyzKonamiEvent {
  type: NgxyzKonamiEventType;
  cheat: NgxyzKonamiCheat;
}
