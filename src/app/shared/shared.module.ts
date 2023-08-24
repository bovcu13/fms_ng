import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ngModule} from './primeng/primeng';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module} from 'ng-recaptcha';
import {environment} from "../../environments/environment";
import {GoogleMapsModule} from '@angular/google-maps'
import {VgCoreModule} from '@videogular/ngx-videogular/core';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';
import {VgStreamingModule} from "@videogular/ngx-videogular/streaming";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    ngModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RecaptchaV3Module,
    GoogleMapsModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey,
    },
  ],
})
export class SharedModule {
}
