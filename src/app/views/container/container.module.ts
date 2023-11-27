import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContainerComponent } from './container.component';
import { ContainerRoutingModule } from './container-routing.module';
import { GoogleMapsModule } from "@angular/google-maps";

// Component
import { RoleComponent } from '../features/role/role.component';
import { MainComponent } from '../features/main/main.component';
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import { MonitorComponent } from "../features/monitor/monitor.component";
import { StreamComponent } from "../features/stream/stream.component";
import { LogComponent } from "../features/log/log.component";
import { MaaaapComponent } from "../features/main/maaaap/maaaap.component";
import { MultipleCarsComponent } from "../features/multiple-cars/multiple-cars.component";
import { DrivingStatusComponent } from "../features/driving-status/driving-status.component";
import { DrawComponent } from "../features/test/draw/draw.component";
import { InfoComponent } from "../features/test/info/info.component";
import { HistoryPathComponent } from "../features/history/history-path.component";
import { CakeReportComponent } from "../features/digital-cake/cake-report/cake-report.component";
import { SignalComponent } from "../features/test/signal/signal.component";
import { BasicDataComponent } from "../features/basic-settings/basic-data/basic-data.component";
import { OddReportComponent } from "../features/odd-list/odd-report/odd-report.component";
import { SpeedingComponent } from "../features/odd-list/speeding/speeding.component";
import { StallComponent } from "../features/odd-list/stall/stall.component";
import { OddTempComponent } from "../features/odd-list/odd-temp/odd-temp.component";
import { PolyComponent } from "../features/test/poly/poly.component";
import { MileComponent } from "../features/statistics/mile/mile.component";
import { PremiumComponent } from "../features/premium/premium.component";
import { SuccessComponent } from "../features/premium/success/success.component";
import { FailedComponent } from "../features/premium/failed/failed.component";
import { VehicleComponent } from "../features/fleet-mgmt/vehicle/vehicle.component";
import { FleetMgmtComponent } from "../features/fleet-mgmt/fleet-mgmt/fleet-mgmt.component";
import { DriverComponent } from "../features/driver-mgmt/driver/driver.component";
import { DispatchComponent } from "../features/dispatch/dispatch/dispatch.component";
import { CustomerComponent } from "../features/customer/customer/customer.component";
import { CompanyComponent } from "../features/customer/company/company.component";
import { ViewDriverComponent } from "../features/driver-mgmt/view-driver/view-driver.component";
import { FleetComponent } from "../features/fleet-mgmt/fleet/fleet.component";
import { WarehouseComponent } from "../features/customer/warehouse/warehouse.component";
import { GpsDeviceComponent } from "../features/fleet-mgmt/gps-device/gps-device.component";
import { DispatchFormComponent } from "../features/dispatch/dispatch-form/dispatch-form.component";
import { DispatchListComponent } from "../features/dispatch/dispatch-form/dispatch-list/dispatch-list.component";
import { ETrackingComponent } from "../features/dispatch/e-tracking/e-tracking.component";
import { WarehouseListComponent } from "../features/my-warehouse/warehouse-list/warehouse-list.component";
import { WarehouseViewComponent } from "../features/my-warehouse/warehouse-view/warehouse-view.component";
import { ETrackingViewComponent } from "../features/dispatch/e-tracking/e-tracking-view/e-tracking-view.component";
import { GoodsViewComponent } from "../features/my-warehouse/goods-view/goods-view.component";
import { EventComponent } from "../features/dispatch/event/event.component";
import { DispatchViewComponent } from "../features/dispatch/dispatch/dispatch-view/dispatch-view.component";
import { TrailersComponent } from "../features/trailers-mgmt/trailers/trailers.component";
import { TrailersMgmtComponent } from "../features/trailers-mgmt/trailers-mgmt.component";
import { InsuranceComponent } from "../features/insurance/insurance.component";
import { EsgDashboardComponent } from "../features/ESG/esg-dashboard/esg-dashboard.component";
import { LandmarkComponent } from "../features/basic-settings/landmark/landmark.component";

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
    InfoComponent,
    HistoryPathComponent,
    CakeReportComponent,
    SignalComponent,
    BasicDataComponent,
    OddReportComponent,
    SpeedingComponent,
    StallComponent,
    OddTempComponent,
    PolyComponent,
    MileComponent,
    PremiumComponent,
    SuccessComponent,
    FailedComponent,
    VehicleComponent,
    FleetMgmtComponent,
    DriverComponent,
    DispatchComponent,
    CustomerComponent,
    CompanyComponent,
    ViewDriverComponent,
    FleetComponent,
    WarehouseComponent,
    GpsDeviceComponent,
    DispatchFormComponent,
    DispatchListComponent,
    ETrackingComponent,
    WarehouseListComponent,
    WarehouseViewComponent,
    ETrackingViewComponent,
    GoodsViewComponent,
    EventComponent,
    DispatchViewComponent,
    TrailersComponent,
    TrailersMgmtComponent,
    InsuranceComponent,
    EsgDashboardComponent,
    LandmarkComponent
  ],
  imports: [
    CommonModule,
    ContainerRoutingModule,
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
  ]
})
export class ContainerModule {
}
