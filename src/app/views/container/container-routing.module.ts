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

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '', component: ContainerComponent,
    children: [
      { path: 'main', component: MainComponent,  },
      { path: 'role', component: RoleComponent,  },
// --------------------FMS-------------------------------------------------------------------------------------------------------------------------------------------------------
      // GPS圖台
      { path: 'multiCars', component: MultipleCarsComponent,  },
      // 車機影像
      { path: 'monitor', component: MonitorComponent,  },
      // 歷史軌跡
      { path: 'history', component: HistoryPathComponent,  },
      // 數位軌跡16-1報表
      { path: 'cake_report', component: CakeReportComponent,  },
      // 車輛行駛日誌
      { path: 'driving_status', component: DrivingStatusComponent,  },
      // 異常報表 - 異常總表
      { path: 'odd_report', component: OddReportComponent,  },
      // 異常報表 - 超速時間
      { path: 'speeding', component: SpeedingComponent,  },
      // 異常報表 - 停不熄火
      { path: 'stall', component: StallComponent,  },
      // 異常報表 - 溫度異常
      { path: 'odd_temp', component: OddTempComponent,  },

// --------------------TMS-------------------------------------------------------------------------------------------------------------------------------------------------------
      // 託運訂單
      { path: 'dispatch_list', component: DispatchListComponent,  },
      { path: 'dispatch_list/:id', component: DispatchFormComponent,  },
      { path: 'dispatch_form', component: DispatchFormComponent,  },
      // 派工與調度
      { path: 'dispatch', component: DispatchComponent,  },
      { path: 'dispatch_view/:id', component: DispatchViewComponent,  },
      { path: 'dispatch_event', component: EventComponent,  },
      // 貨態追蹤
      { path: 'e_tracking', component: ETrackingComponent,  },
      { path: 'e_tracking_view', component: ETrackingViewComponent,  },

// --------------------行政管理中心-------------------------------------------------------------------------------------------------------------------------------------------------------
      // 保險管理
      { path: 'insurance', component: InsuranceComponent,  },
      // 我的倉儲
      { path: 'warehouse_list', component: WarehouseListComponent,  },
      { path: 'warehouse_list/:id', component: WarehouseViewComponent,  },
      { path: 'goods_view/:id', component: GoodsViewComponent,  },
      // 客戶管理
      { path: 'customer', component: CustomerComponent,  },
      { path: 'company/:id', component: CompanyComponent,  },
      { path: 'warehouse/:id', component: WarehouseComponent,  },
      // 車隊管理
      { path: 'fleet_mgmt', component: FleetMgmtComponent,  },
      { path: 'fleet_mgmt/:id', component: FleetMgmtComponent,  }, // 點進編輯頁面返回時在同一個tab
      { path: 'vehicle/:id', component: VehicleComponent,  },
      { path: 'fleet/:id', component: FleetComponent,  },
      { path: 'gps_device/:id', component: GpsDeviceComponent,  },
      // 板車管理
      { path: 'trailers', component: TrailersMgmtComponent,  },
      { path: 'trailers/:id', component: TrailersComponent,  },
      // 司機管理
      { path: 'driver', component: DriverComponent,  },
      { path: 'driver/:id', component: ViewDriverComponent,  },
      // --------------------設定------------------------------------------------------------
      // 基本設定
      { path: 'basic_data', component: BasicDataComponent,  },
      // 自建地標
      { path: 'landmark', component: LandmarkComponent,  },

// --------------------ESG-------------------------------------------------------------------------------------------------------------------------------------------------------
      // 零碳整合儀表板
      { path: 'esg_dashboard', component: EsgDashboardComponent,  },
      // 碳足跡揭露 - 里程統計
      { path: 'mile', component: MileComponent,  },

// --------------------平台服務專區-------------------------------------------------------------------------------------------------------------------------------------------------------
      // premium
      { path: 'premium', component: PremiumComponent,  },
      { path: 'pay_success', component: SuccessComponent,  },
      { path: 'pay_failed', component: FailedComponent,  },

// --------------------更新日誌-------------------------------------------------------------------------------------------------------------------------------------------------------
      { path: 'log', component: LogComponent,  },

// --------------------test-------------------------------------------------------------------------------------------------------------------------------------------------------
      { path: 'stream', component: StreamComponent,  },
      { path: 'map', component: MaaaapComponent,  },
      { path: 'draw', component: DrawComponent,  },
      { path: 'info', component: InfoComponent,  },
      { path: 'signal', component: SignalComponent,  },
      { path: 'poly', component: PolyComponent,  },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainerRoutingModule {
}
