import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from './container.component';
import { RoleComponent } from '../features/role/role.component';
import { MainComponent } from "../features/main/main.component";
import { AuthGuard } from "../../shared/guard/auth.guard";
import { MonitorComponent } from "../features/monitor/monitor.component";
import { StreamComponent } from "../features/stream/stream.component";
import { LogComponent } from "../features/log/log.component";
import { MaaaapComponent } from "../features/main/maaaap/maaaap.component";
import { MultipleCarsComponent } from "../features/multiple-cars/multiple-cars.component";
import { DrivingStatusComponent } from "../features/driving-status/driving-status.component";
import { DrawComponent } from "../features/test/draw/draw.component";
import { InfoComponent } from "../features/test/info/info.component";


const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '', component: ContainerComponent,
    children: [
      { path: 'main', component: MainComponent, canActivate: [AuthGuard] },
      { path: 'role', component: RoleComponent, canActivate: [AuthGuard] },
      { path: 'monitor', component: MonitorComponent, canActivate: [AuthGuard] },
      { path: 'stream', component: StreamComponent, canActivate: [AuthGuard] },
      { path: 'log', component: LogComponent, canActivate: [AuthGuard] },
      { path: 'multiCars', component: MultipleCarsComponent, canActivate: [AuthGuard] },
      { path: 'driving_status', component: DrivingStatusComponent, canActivate: [AuthGuard] },
      //test
      { path: 'map', component: MaaaapComponent, canActivate: [AuthGuard] },
      { path: 'draw', component: DrawComponent, canActivate: [AuthGuard] },
      { path: 'info', component: InfoComponent, canActivate: [AuthGuard] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainerRoutingModule {
}
