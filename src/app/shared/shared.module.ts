import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ngModule} from './primeng/primeng';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from "@angular/forms";
import {AuthGuard} from "./guard/auth.guard";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    ngModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [AuthGuard]
})
export class SharedModule {
}
