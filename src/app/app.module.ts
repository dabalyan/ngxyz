import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SvgIconDirective} from './directives/svg-icon.directive';

import {NgxyzKonamiModule} from 'ngxyz-konami';

@NgModule({
  declarations: [
    AppComponent,
    SvgIconDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxyzKonamiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
