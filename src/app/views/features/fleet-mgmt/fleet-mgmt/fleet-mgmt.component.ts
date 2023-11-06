import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CarService } from "../../../../services/car.service";
import { ActivatedRoute, Router } from "@angular/router";
import { TabView } from "primeng/tabview";
import { ConfirmationService, MessageService } from "primeng/api";
import { trailers } from "../../../../shared/data/trailers";

@Component({
  selector: 'app-fleet-mgmt',
  templateUrl: './fleet-mgmt.component.html',
  styleUrls: ['./fleet-mgmt.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class FleetMgmtComponent {
  activeIndex: number = 0;

  @ViewChild(TabView) tabView!: TabView;

  addVehicle_form: FormGroup;
  addFleet_form: FormGroup;
  addGpsDevice_form: FormGroup;
  // addTrailers_form: FormGroup;

  constructor(
    private carServ: CarService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.addVehicle_form = this.fb.group({
      fleet_id: ['c2d40ef0-341a-4793-b1b3-f4e4f82ba9f2', Validators.required],
      name: ['', Validators.required],
      driver: ['', Validators.required],
      license_plate: ['', Validators.required],
      sid: ['', Validators.required]
    });

    this.addFleet_form = this.fb.group({
      fleet_code: ['', Validators.required],
      name: ['', Validators.required]
    });

    this.addGpsDevice_form = this.fb.group({
      firm: ['', Validators.required],
      id: ['', Validators.required],
      model: ['', Validators.required],
      sid: ['', Validators.required]
    });

    // this.addTrailers_form = this.fb.group({
    //   id: ['', Validators.required],
    //   code: ['', Validators.required]
    // });
  }

  ngOnInit() {
    // 取得路由參數中的 fleetId
    this.route.params.subscribe(params => {
      this.activeIndex = params['id'];
      // 現在你可以在這裡使用 fleetId 了
    });
    this.getAllFleetsRequest();
    this.getAllVehiclesRequest();
    this.getAllGpsDevicesRequest();
    this.getAllDriversRequest();
    // this.getAllTrailersRequest();
  }

  // 取得車隊
  fleetsData: any;
  getAllFleetsRequest() {
    this.carServ.getAllFleetRequest().subscribe({
      next: res => {
        this.fleetsData = res.body.fleets;
        console.log('fleetsData', res.body.fleets)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addFleetDialogVisible = false;
  closeAddFleetDialog() {
    this.addFleetDialogVisible = false;
    this.showCancel('新增');
    this.addFleet_form.reset();
  }

  // 新增車隊
  postFleetRequest() {
    let body = {
      fleet_code: this.addFleet_form.controls['fleet_code'].value,
      name: this.addFleet_form.controls['name'].value
    }
    this.carServ.postFleetRequest(body).subscribe({
      next: data => {
        this.showSussess('新增');
        this.addFleetDialogVisible = false;
        this.addFleet_form.reset();
        this.getAllFleetsRequest();
        console.log(data);
        console.log(body);
      },
      error: (err) => {
        this.showError('新增');
        console.log(err);
      },
    });
    this.getAllFleetsRequest()
  }

  cars: any;
  vehiclesData: any;

  // 取得車輛
  getAllVehiclesRequest() {
    this.carServ.getAllVehiclesRequest(1, 20).subscribe({
      next: res => {
        this.vehiclesData = res.body.vehicles;
        this.cars = this.vehiclesData.map((item: any) => ({
          name: item.license_plate,
          code: item.license_plate
        }));
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addCarDialogVisible = false;
  openAddCarDialog() {
    this.addCarDialogVisible = true;
  }
  closeAddCarDialog() {
    this.addCarDialogVisible = false;
    this.showCancel('新增');
    this.addVehicle_form.reset();
  }

  // 新增車輛
  postVehicleRequest() {
    let body = {
      fleet_id: this.addVehicle_form.controls['fleet_id'].value,
      name: this.addVehicle_form.controls['name'].value,
      driver: this.addVehicle_form.controls['driver'].value,
      license_plate: this.addVehicle_form.controls['license_plate'].value,
      sid: this.addVehicle_form.controls['sid'].value.sid
    }
    this.carServ.postVehicleRequest(body).subscribe({
      next: data => {
        this.showSussess('新增');
        this.addCarDialogVisible = false;
        this.addVehicle_form.reset();
        console.log(data);
        console.log(body);
        this.getAllVehiclesRequest();
      },
      error: (err) => {
        this.showError('新增');
        console.log(err);
        console.log(body);
      },
    });
  }

  gpsDevicesData: any;

  // 取得車機
  getAllGpsDevicesRequest() {
    this.carServ.getGpsDevicesRequest().subscribe({
      next: res => {
        this.gpsDevicesData = res.body.gps_devices;
        console.log('gpsDevicesData', res.body.gps_devices)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  driverData: any;

  // 取得司機
  getAllDriversRequest() {
    this.carServ.getAllDriversRequest().subscribe({
      next: res => {
        this.driverData = res.body.drivers;
        console.log('driverData',this.driverData);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // trailersData : any;
  //
  // // 取得板車
  // getAllTrailersRequest() {
  //   this.carServ.getAllTrailersRequest().subscribe({
  //     next: res => {
  //       this.trailersData = res.body.trailers;
  //       console.log('trailersData',this.trailersData);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }

  // addTrailersDialogVisible = false;
  // openAddTrailersDialog() {
  //   this.addTrailersDialogVisible = true;
  // }
  // closeAddTrailersDialog() {
  //   this.addTrailersDialogVisible = false;
  //   this.showCancel('新增');
  //   this.addTrailers_form.reset();
  // }

  // // 新增板車
  // postTrailersRequest() {
  //   let body = {
  //     code: this.addTrailers_form.controls['code'].value
  //   }
  //   this.carServ.postTrailersRequest(body).subscribe({
  //     next: data => {
  //       this.showSussess('新增');
  //       this.addTrailersDialogVisible = false;
  //       this.addTrailers_form.reset();
  //       console.log(data);
  //       console.log(body);
  //       this.getAllTrailersRequest();
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       console.log(body);
  //     },
  //   });
  // }

  // 跳轉頁面
  goToVehicle(id: any) {
    this.router.navigate(['/vehicle', id])
  }
  goToFleet(id: any) {
    this.router.navigate(['/fleet', id])
  }
  goToGpsDevice(id: any) {
    this.router.navigate(['/gps_device', id])
  }
  // goToTrailers(id: any) {
  //   this.router.navigate(['/trailers', id])
  // }

  // 操作結果提示
  showSussess(info = '修改') {
    this.messageService.add({ severity: 'success', summary: '完成', detail: `${info}成功！` });
  }

  showError(info = '修改') {
    this.messageService.add({ severity: 'error', summary: '錯誤', detail: `${info}失敗！` });
  }

  showCancel(info: string = '修改') {
    this.messageService.add({ severity: 'warn', summary: '取消', detail: `取消${info}！` });
  }

}
