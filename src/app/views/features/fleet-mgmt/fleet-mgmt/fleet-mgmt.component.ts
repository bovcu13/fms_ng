import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CarService} from "../../../../services/car.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TabView} from "primeng/tabview";

@Component({
  selector: 'app-fleet-mgmt',
  templateUrl: './fleet-mgmt.component.html',
  styleUrls: ['./fleet-mgmt.component.scss']
})
export class FleetMgmtComponent {

  activeIndex: number = 0;

  @ViewChild(TabView) tabView!: TabView;

  addVehicle_form: FormGroup;
  addFleet_form: FormGroup;
  addGpsDevice_form: FormGroup;

  constructor(private carServ: CarService,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute) {
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
  }

  ngOnInit() {
    // 取得路由參數中的 fleetId
    this.route.params.subscribe(params => {
      this.activeIndex = params['id'];
      // 現在你可以在這裡使用 fleetId 了
    });
    this.getAllFleetsRequest()
    this.getAllVehiclesRequest()
    this.getAllGpsDevicesRequest()
  }

  fleetsData: any;
  addFleetDialogVisible = false;

  // 取得車隊
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

  // 新增車隊
  postFleetRequest() {
    let body = {
      fleet_code: this.addFleet_form.controls['fleet_code'].value,
      name: this.addFleet_form.controls['name'].value
    }
    this.carServ.postFleetRequest(body).subscribe({
      next: data => {
        console.log(data)
        console.log(body)
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.getAllFleetsRequest()
  }

  cars: any;
  vehiclesData: any;

  // 取得車牌
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

  // 新增車輛
  postVehicleRequest() {
    let body = {
      fleet_id: this.addVehicle_form.controls['fleet_id'].value,
      name: this.addVehicle_form.controls['name'].value,
      driver: this.addVehicle_form.controls['driver'].value,
      license_plate: this.addVehicle_form.controls['license_plate'].value,
      sid: this.addVehicle_form.controls['sid'].value
    }
    this.carServ.postVehicleRequest(body).subscribe({
      next: data => {
        console.log(data)
        console.log(body)
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.getAllVehiclesRequest()
  }

  gpsDevicesData: any;

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


}
