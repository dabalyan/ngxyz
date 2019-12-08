import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SvgIconDirective} from './directives/svg-icon.directive';

@NgModule({
  declarations: [
    AppComponent,
    SvgIconDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
