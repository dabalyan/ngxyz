# ngXYZ-C2C [![npm version](https://badge.fury.io/js/ngxyz-c2c.svg)](https://www.npmjs.com/package/ngxyz-c2c)

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
<p ngxyzC2c>
  When you click me, my text gets selected, highlighted and copied into clipboard.
  Look Ma, it just works.
</p>

or you can use me by another name if you like

<p ngxyzC2C>
  When you click me, my text gets selected, highlighted and copied into clipboard.
  Look Ma, this also works.
</p>

disable animation if you want

<p [ngxyzC2c]="{animation: false}">
  When you click me, my text gets selected, highlighted and copied into clipboard.
  It doesn't animate, but it does copy.
</p>

or make it pop, with bigger animation-icon,
just remember to pass a number, it's in pixels by the way

<p [ngxyzC2c]="{iconSize: 120, iconColor: 'red'}">
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
    this.c2cService.c2c('You are awesome.');


    // this will copy the innerText of the DOM Element and will also select/highlight it at the same time
    this.c2cService.c2c(someElement);


    // it works the same as above but with bigger animation-copy-icon
    this.c2cService.c2c(someElement, {iconSize: 120});

    // it works the same as above but with red animation-copy-icon
    this.c2cService.c2c(someElement, {iconSize: 120, iconColor: 'red'});


    // this works silently without any animation
    this.c2cService.c2c(someElement, {animation: false});

    // but if you want it to behave the same way all the time you can configure it in one go
    // just do it like this somewhere in your app, preferably in you AppComponent
    this.c2cService.configure({iconSize: 24, iconColor: 'red'});


    // and now all the subsequent calls will run animation with 24px big red copy-icon
    this.c2cService.c2c(someElement);
}
```
