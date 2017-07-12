import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/home/component';

import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
	  apiKey: 'AIzaSyB4fukSEXEXfioO1YnYbq6hMjsNBmcaXZg'
	})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
