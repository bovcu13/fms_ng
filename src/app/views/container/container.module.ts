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
import {MaaaapComponent} from "../features/main/maaaap/maaaap.component";
import {MultipleCarsComponent} from "../features/multiple-cars/multiple-cars.component";
import {DrivingStatusComponent} from "../features/driving-status/driving-status.component";
import {DrawComponent} from "../features/test/draw/draw.component";
import {InfoComponent} from "../features/test/info/info.component";

@NgModule({
  declarations: [
    ContainerComponent,
    RoleComponent,
    MainComponent,
    MonitorComponent,
    SidebarComponent,
    StreamComponent,
    LogComponent,
    MaaaapComponent,
    MultipleCarsComponent,
    DrivingStatusComponent,
    DrawComponent,
    InfoComponent
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
