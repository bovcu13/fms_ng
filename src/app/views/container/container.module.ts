import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'src/app/shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ContainerComponent} from './container.component';
import {ContainerRoutingModule} from './container-routing.module';
import {GoogleMapsModule} from "@angular/google-maps";

// Component
import {RoleComponent} from '../features/role/role.component';
import {MainComponent} from '../features/main/main.component';
import {SidebarComponent} from "../components/sidebar/sidebar.component";
import {MonitorComponent} from "../features/monitor/monitor.component";
import {StreamComponent} from "../features/stream/stream.component";
import {LogComponent} from "../features/log/log.component";

@NgModule({
  declarations: [
    ContainerComponent,
    RoleComponent,
    MainComponent,
    MonitorComponent,
    SidebarComponent,
    StreamComponent,
    LogComponent
  ],
  imports: [
    CommonModule,
    ContainerRoutingModule,
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule
  ]
})
export class ContainerModule {
}
