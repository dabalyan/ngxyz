# ngXYZ-C2C
## An Angular Module to copy text to clipboard.
- Includes a Directive which can be applied directly to the Element whose content (innerText) needs to be copied. 
- Also includes a Service which can be used to directly interact with the underlying API for more advanced or customised use cases.

## Setup
    npm i ngxyz-c2c

## Usage
- Well, first you gotta import **NgxyzC2cModule** into your **AppModule** (or any other Module where you intend to use it)
```typescript
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {NgxyzC2cModule} from 'ngxyz-c2c';

@NgModule({
  declarations: [
    // your components, directives, pipes
  ],
  imports: [
    BrowserModule,

    NgxyzC2cModule // this module officer, right here
  ],
  providers: [],
  bootstrap: [AppComponent] // your bootstrapped component
})
export class AppModule {
}
``` 
Using the **Directive**
```html
<p libNgxyzC2c>
  When you click me, my text gets selected, highlighted and copied into clipboard.
  Look Ma, it just works.
</p>

or you can use me by another name if you like

<p libNgxyzC2C>
  When you click me, my text gets selected, highlighted and copied into clipboard.
  Look Ma, this also works.
</p>

disable animation if you want

<p [libNgxyzC2c]="{animation: false}">
  When you click me, my text gets selected, highlighted and copied into clipboard.
  It doesn't animate, but it does copy.
</p>

or make it pop, with bigger animation-icon,
just remember to pass a number, it's in pixels by the way

<p [libNgxyzC2c]="{iconSize: 120, iconColor: 'red'}">
  When you click me, my text gets selected and copied into clipboard.
  Also you see that BIG RED animation-icon DO YOU?
</p>
```

Using the **Service**
```typescript

import {NgxyzC2cService} from 'ngxyz-c2c';

// inject the service
constructor(private c2cService: NgxyzC2cService) {
}

// remember this only works when user makes an action, eg: click
// otherwise browsers ignore the copy command.

userClickedSomethingSoLetsCopySomething(someElement: HTMLElement) {
    // this will copy the text silently into the clipboard
    this.c2cService.copyTextToClipboard('You are awesome.');


    // this will copy the innerText of the DOM Element and will also select/highlight it at the same time
    this.c2cService.copyInnerTextToClipboard(someElement);


    // it works the same as above but with bigger animation-copy-icon
    this.c2cService.copyInnerTextToClipboard(someElement, {iconSize: 120});

    // it works the same as above but with red animation-copy-icon
    this.c2cService.copyInnerTextToClipboard(someElement, {iconSize: 120, iconColor: 'red'});


    // this works silently without any animation
    this.c2cService.copyInnerTextToClipboard(someElement, {animation: false});
    // which is the same thing as this
    this.c2cService.executeCopyToClipboardOn(someElement);
    

    // but if you want it to behave the same way all the time you can configure it in one go
    // just do it like this somewhere in your app, preferably in you AppComponent
    this.c2cService.configure({iconSize: 24, iconColor: 'red'});


    // and now all the subsequent calls will run animation with 24px big red copy-icon
    this.c2cService.copyInnerTextToClipboard(someElement);
}
```

# For Contributors / Tinkerers
This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.14.

## Code scaffolding

Run `ng generate component component-name --project ngxyz-c2c` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project ngxyz-c2c`.
> Note: Don't forget to add `--project ngxyz-c2c` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build ngxyz-c2c` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build ngxyz-c2c`, go to the dist folder `cd dist/ngxyz-c2c` and run `npm publish`.

## Running unit tests

Run `ng test ngxyz-c2c` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
