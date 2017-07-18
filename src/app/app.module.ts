import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/home/component';

import { AgmCoreModule } from '@agm/core';

import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MdSelectModule } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MdSelectModule,
    AgmCoreModule.forRoot({
	  apiKey: 'AIzaSyB4fukSEXEXfioO1YnYbq6hMjsNBmcaXZg'
	})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
