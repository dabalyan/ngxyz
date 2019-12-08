[![npm version](https://badge.fury.io/js/ngxyz-konami.svg)](https://www.npmjs.com/package/ngxyz-konami)

# ngXYZ-Konami
##An Angular Module to add Konami Codes (Cheat Codes / Easter Eggs) to your Angular App
 * Inspired by original Konami Cheat Codes
 * This is a Service which listens to Keyboard.keydown events and triggers a cheat (callback function) if the cheat code matched with
   what was entered by the user.
 * You can also use it to Show/Hide features in your production website.
 * You can use localstorage in combination and preserve the state of Showing/Hiding that feature, once revealed.
 * For Example, Provided a code like "HELLO" and a Callback function. When the user types "HELLO"
, the callback function will be called. You can do whatever you want in that callback.

## Setup
    npm i ngxyz-konami
    
## Usage
- Well, first you gotta import **NgxyzKonamiModule** into your **AppModule** (or any other Module where you intend to use it)
```typescript
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {NgxyzKonamiModule} from 'ngxyz-konami';

@NgModule({
  declarations: [
    // your components, directives, pipes
  ],
  imports: [
    BrowserModule,

    NgxyzKonamiModule // this module officer, right here
  ],
  providers: [],
  bootstrap: [AppComponent] // your bootstrapped component
})
export class AppModule {
}
```

Inject the Service
```typescript
import {NgxyzKonamiService} from 'ngxyz-konami';

// inject the service
constructor(private konamiService: NgxyzKonamiService) {
}
```

Simplest usage, a cheat when triggered shows the message in a message-dialog.
```typescript
// register a cheat
this.konamiService.showMessages = true; // without this the message will not be shown
this.konamiService.addCheat({code: 'hello', message: 'Say Hello Back'});
// now click in an empty space, and type 'hello' without the quotes.
```

A cheat with callback, once triggered the callback will be called
```typescript
// register a cheat
this.konamiService.addCheat({code: 'hello', action: () => {alert('A different kind of hello.')}});
// now click in an empty space, and type 'hello' without the quotes.
```

Configure it in one go, register all the cheats at once.
```typescript
// configure the service, all of this is optional, every option is optional
this.konamiService.configure({
    activationCode: 'ActivateKonamiServiceWhenThisIsTyped', // none of the cheats will be triggered before this
    deactivationCode: 'DeactivateKonamiServiceWhenThisIsTyped',  // none of the cheats will be triggered after this
    logEvents: true, // this will let you know when a cheat gets triggered in the browser console
    showMessages: true, // by default it's false, but now all subsequent cheats will show the message-dialog once triggered
    ignoreFormElements: true, // now cheats will be triggered even if you are filling up a form
    cheats: [{
        code: 'hello',
        message: 'Hey There'
    },
    {
        code: 'bye',
        message: 'Sayonara my friend, see you later.'
    },
    {
        code: 'youtubeTime',
        action: () => {
            // now we youtube, don't resist
            location.href="//youtube.com"
        }
    }]
});
// now click in an empty space, and type a code eg: 'bye' without the quotes.
```

Remove an already registered cheat.
```typescript
this.konamiService.removeCheat('youtubeTime');
```

Get the original, already registered cheat.
```typescript
this.konamiService.getCheat('youtubeTime');
```

Remove all the registered cheats.
```typescript
this.konamiService.clearCheats();
```

Disable KonamiService manually.
```typescript
this.konamiService.disable();
```

Enable KonamiService manually.
```typescript
this.konamiService.enable();
```

# For Contributors / Tinkerers
This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.14.

## Code scaffolding

Run `ng generate component component-name --project ngxyz-konami` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project ngxyz-konami`.
> Note: Don't forget to add `--project ngxyz-konami` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build ngxyz-konami` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build ngxyz-konami`, go to the dist folder `cd dist/ngxyz-konami` and run `npm publish`.

## Running unit tests

Run `ng test ngxyz-konami` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
