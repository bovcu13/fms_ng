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
import { HistoryPathComponent } from "../features/history/history-path.component";
import { RecordComponent } from "../features/statistics/record/record.component";
import { CakeReportComponent } from "../features/digital-cake/cake-report/cake-report.component";
import { SignalComponent } from "../features/test/signal/signal.component";
import { BasicDataComponent } from "../features/basic-settings/basic-data/basic-data.component";
import { OddSetComponent } from "../features/basic-settings/odd-set/odd-set.component";
import { OddReportComponent } from "../features/odd-list/odd-report/odd-report.component";
import { SpeedingComponent } from "../features/odd-list/speeding/speeding.component";
import { StallComponent } from "../features/odd-list/stall/stall.component";
import { OddTempComponent } from "../features/odd-list/odd-temp/odd-temp.component";
import { PolyComponent } from "../features/test/poly/poly.component";
import { MileComponent } from "../features/statistics/mile/mile.component";


const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '', component: ContainerComponent,
    children: [
      { path: 'main', component: MainComponent, canActivate: [AuthGuard] },
      { path: 'role', component: RoleComponent, canActivate: [AuthGuard] },
      { path: 'monitor', component: MonitorComponent, canActivate: [AuthGuard] },
      { path: 'multiCars', component: MultipleCarsComponent, canActivate: [AuthGuard] },
      { path: 'driving_status', component: DrivingStatusComponent, canActivate: [AuthGuard] },
      { path: 'history', component: HistoryPathComponent, canActivate: [AuthGuard] },
      // cake
      { path: 'cake_report', component: CakeReportComponent, canActivate: [AuthGuard] },
      // statistics
      { path: 'record', component: RecordComponent, canActivate: [AuthGuard] },
      { path: 'mile', component: MileComponent, canActivate: [AuthGuard] },
      // odd-list
      { path: 'odd_report', component: OddReportComponent, canActivate: [AuthGuard] },
      { path: 'speeding', component: SpeedingComponent, canActivate: [AuthGuard] },
      { path: 'stall', component: StallComponent, canActivate: [AuthGuard] },
      { path: 'odd_temp', component: OddTempComponent, canActivate: [AuthGuard] },
      // basic-settings
      { path: 'basic_data', component: BasicDataComponent, canActivate: [AuthGuard] },
      { path: 'odd_set', component: OddSetComponent, canActivate: [AuthGuard] },
      // log
      { path: 'log', component: LogComponent, canActivate: [AuthGuard] },
      // test
      { path: 'stream', component: StreamComponent, canActivate: [AuthGuard] },
      { path: 'map', component: MaaaapComponent, canActivate: [AuthGuard] },
      { path: 'draw', component: DrawComponent, canActivate: [AuthGuard] },
      { path: 'info', component: InfoComponent, canActivate: [AuthGuard] },
      { path: 'signal', component: SignalComponent, canActivate: [AuthGuard] },
      { path: 'poly', component: PolyComponent, canActivate: [AuthGuard] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainerRoutingModule {
}
