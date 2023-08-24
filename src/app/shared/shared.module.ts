import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ngModule} from './primeng/primeng';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module} from 'ng-recaptcha';
import {environment} from "../../environments/environment";
import {GoogleMapsModule} from '@angular/google-maps'


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
    GoogleMapsModule
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
