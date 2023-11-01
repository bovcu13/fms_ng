import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContainerComponent} from './container.component';
import {RoleComponent} from '../features/role/role.component';
import {MainComponent} from "../features/main/main.component";
import {AuthGuard} from "../../shared/guard/auth.guard";
import {MonitorComponent} from "../features/monitor/monitor.component";
import {StreamComponent} from "../features/stream/stream.component";
import {LogComponent} from "../features/log/log.component";
import {MaaaapComponent} from "../features/main/maaaap/maaaap.component";
import {MultipleCarsComponent} from "../features/multiple-cars/multiple-cars.component";
import {DrivingStatusComponent} from "../features/driving-status/driving-status.component";
import {DrawComponent} from "../features/test/draw/draw.component";
import {InfoComponent} from "../features/test/info/info.component";
import {HistoryPathComponent} from "../features/history/history-path.component";
import {RecordComponent} from "../features/statistics/record/record.component";
import {CakeReportComponent} from "../features/digital-cake/cake-report/cake-report.component";
import {SignalComponent} from "../features/test/signal/signal.component";
import {BasicDataComponent} from "../features/basic-settings/basic-data/basic-data.component";
import {OddSetComponent} from "../features/basic-settings/odd-set/odd-set.component";
import {OddReportComponent} from "../features/odd-list/odd-report/odd-report.component";
import {SpeedingComponent} from "../features/odd-list/speeding/speeding.component";
import {StallComponent} from "../features/odd-list/stall/stall.component";
import {OddTempComponent} from "../features/odd-list/odd-temp/odd-temp.component";
import {PolyComponent} from "../features/test/poly/poly.component";
import {MileComponent} from "../features/statistics/mile/mile.component";
import {PremiumComponent} from "../features/premium/premium.component";
import {SuccessComponent} from "../features/premium/success/success.component";
import {FailedComponent} from "../features/premium/failed/failed.component";
import {TempDashboardComponent} from "../features/temp-control/temp-dashboard/temp-dashboard.component";
import {VehicleComponent} from "../features/fleet-mgmt/vehicle/vehicle.component";
import {FleetMgmtComponent} from "../features/fleet-mgmt/fleet-mgmt/fleet-mgmt.component";
import {DriverComponent} from "../features/driver-mgmt/driver/driver.component";
import {DispatchComponent} from "../features/dispatch/dispatch/dispatch.component";
import {CustomerComponent} from "../features/customer/customer/customer.component";
import {CompanyComponent} from "../features/customer/company/company.component";
import {ViewDriverComponent} from "../features/driver-mgmt/view-driver/view-driver.component";
import {FleetComponent} from "../features/fleet-mgmt/fleet/fleet.component";
import {WarehouseComponent} from "../features/customer/warehouse/warehouse.component";
import {GpsDeviceComponent} from "../features/fleet-mgmt/gps-device/gps-device.component";
import {DispatchFormComponent} from "../features/dispatch/dispatch-form/dispatch-form.component";
import {DispatchListComponent} from "../features/dispatch/dispatch-form/dispatch-list/dispatch-list.component";
import {ETrackingComponent} from "../features/dispatch/e-tracking/e-tracking.component";
import {WarehouseListComponent} from "../features/my-warehouse/warehouse-list/warehouse-list.component";
import {WarehouseViewComponent} from "../features/my-warehouse/warehouse-view/warehouse-view.component";
import {ETrackingViewComponent} from "../features/dispatch/e-tracking/e-tracking-view/e-tracking-view.component";
import {GoodsViewComponent} from "../features/my-warehouse/goods-view/goods-view.component";
import {EventComponent} from "../features/dispatch/event/event.component";
import {DispatchViewComponent} from "../features/dispatch/dispatch/dispatch-view/dispatch-view.component";

const routes: Routes = [
  {path: '', redirectTo: '', pathMatch: 'full'},
  {
    path: '', component: ContainerComponent,
    children: [
      {path: 'main', component: MainComponent, canActivate: [AuthGuard]},
      {path: 'role', component: RoleComponent, canActivate: [AuthGuard]},
      {path: 'monitor', component: MonitorComponent, canActivate: [AuthGuard]},
      {path: 'multiCars', component: MultipleCarsComponent, canActivate: [AuthGuard]},
      {path: 'driving_status', component: DrivingStatusComponent, canActivate: [AuthGuard]},
      {path: 'history', component: HistoryPathComponent, canActivate: [AuthGuard]},
      // dispatch
      {path: 'dispatch', component: DispatchComponent, canActivate: [AuthGuard]},
      {path: 'dispatch_view/:id', component: DispatchViewComponent, canActivate: [AuthGuard]},
      {path: 'dispatch_list', component: DispatchListComponent, canActivate: [AuthGuard]},
      {path: 'dispatch_list/:id', component: DispatchFormComponent, canActivate: [AuthGuard]},
      {path: 'dispatch_form', component: DispatchFormComponent, canActivate: [AuthGuard]},
      {path: 'e_tracking', component: ETrackingComponent, canActivate: [AuthGuard]},
      {path: 'e_tracking_view', component: ETrackingViewComponent, canActivate: [AuthGuard]},
      {path: 'dispatch_event', component: EventComponent, canActivate: [AuthGuard]},
      // my-warehouse
      {path: 'warehouse_list', component: WarehouseListComponent, canActivate: [AuthGuard]},
      {path: 'warehouse_list/:id', component: WarehouseViewComponent, canActivate: [AuthGuard]},
      {path: 'goods_view/:id', component: GoodsViewComponent, canActivate: [AuthGuard]},
      // customer
      {path: 'customer', component: CustomerComponent, canActivate: [AuthGuard]},
      {path: 'company/:id', component: CompanyComponent, canActivate: [AuthGuard]},
      {path: 'warehouse/:id', component: WarehouseComponent, canActivate: [AuthGuard]},
      // premium
      {path: 'premium', component: PremiumComponent, canActivate: [AuthGuard]},
      {path: 'pay_success', component: SuccessComponent, canActivate: [AuthGuard]},
      {path: 'pay_failed', component: FailedComponent, canActivate: [AuthGuard]},
      // cake
      {path: 'cake_report', component: CakeReportComponent, canActivate: [AuthGuard]},
      // temp-control
      {path: 'temp_dashboard', component: TempDashboardComponent, canActivate: [AuthGuard]},
      // statistics
      {path: 'record', component: RecordComponent, canActivate: [AuthGuard]},
      {path: 'mile', component: MileComponent, canActivate: [AuthGuard]},
      // odd-list
      {path: 'odd_report', component: OddReportComponent, canActivate: [AuthGuard]},
      {path: 'speeding', component: SpeedingComponent, canActivate: [AuthGuard]},
      {path: 'stall', component: StallComponent, canActivate: [AuthGuard]},
      {path: 'odd_temp', component: OddTempComponent, canActivate: [AuthGuard]},
      // basic-settings
      {path: 'basic_data', component: BasicDataComponent, canActivate: [AuthGuard]},
      {path: 'odd_set', component: OddSetComponent, canActivate: [AuthGuard]},
      // fleet-mgmt
      {path: 'fleet_mgmt', component: FleetMgmtComponent, canActivate: [AuthGuard]},
      {path: 'fleet_mgmt/:id', component: FleetMgmtComponent, canActivate: [AuthGuard]},
      {path: 'vehicle/:id', component: VehicleComponent, canActivate: [AuthGuard]},
      {path: 'fleet/:id', component: FleetComponent, canActivate: [AuthGuard]},
      {path: 'gps_device/:id', component: GpsDeviceComponent, canActivate: [AuthGuard]},
      // driver-mgmt
      {path: 'driver', component: DriverComponent, canActivate: [AuthGuard]},
      {path: 'driver/:id', component: ViewDriverComponent, canActivate: [AuthGuard]},
      // log
      {path: 'log', component: LogComponent, canActivate: [AuthGuard]},
      // test
      {path: 'stream', component: StreamComponent, canActivate: [AuthGuard]},
      {path: 'map', component: MaaaapComponent, canActivate: [AuthGuard]},
      {path: 'draw', component: DrawComponent, canActivate: [AuthGuard]},
      {path: 'info', component: InfoComponent, canActivate: [AuthGuard]},
      {path: 'signal', component: SignalComponent, canActivate: [AuthGuard]},
      {path: 'poly', component: PolyComponent, canActivate: [AuthGuard]},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainerRoutingModule {
}
